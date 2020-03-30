import json
import datetime
from django.http import HttpResponse
from django.utils import timezone
from .models import Competitor, Setting


def authenticate(cc):
    competitors = Competitor.objects.filter(competitor_code=cc)
    if len(competitors) == 0:
        return {'status': 'invalid code'}
    competitor = competitors[0]
    now = timezone.now()
    if competitor.login_time is None:
        login_window = Setting.objects.get(key='login_window').value_int
        start_time = competitor.task_start
        end_time = start_time + datetime.timedelta(seconds=login_window)
        if start_time > now:
            return {'status': 'too early', 'competitor': competitor}
        elif end_time < now:
            return {'status': 'too late', 'competitor': competitor}
        else:
            return {'status': 'ok', 'competitor': competitor}
    else:
        task_time = Setting.objects.get(key='task_time').value_int
        start_time = competitor.login_time
        end_time = start_time + datetime.timedelta(seconds=task_time)
        if end_time < now:
            return {'status': 'time is up', 'competitor': competitor}
        else:
            remaining_time = (end_time - now).total_seconds()
            return {'status': 'ok', 'competitor': competitor, 'remaining_time': remaining_time}


def login(request):
    if request.method == 'POST':
        req = json.loads(request.body.decode('utf-8'))
        auth = authenticate(req['cc'])
        if auth['status'] == 'ok':
            if auth['competitor'].login_time is None:
                auth['competitor'].login_time = timezone.now()
                auth['competitor'].save()
                auth = authenticate(req['cc'])
            return HttpResponse(json.dumps({
                'status': auth['status'],
                'name': auth['competitor'].full_name,
                'remaining_time': auth['remaining_time']
            }))
        else:
            return HttpResponse(json.dumps({'status': auth['status']}))
