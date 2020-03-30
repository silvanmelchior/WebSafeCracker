import json
import datetime
from django.http import HttpResponse
from django.utils import timezone
from .models import User, Setting


def authenticate(cc):
    users = User.objects.filter(competitor_code=cc)
    if len(users) == 0:
        return {'status': 'invalid code'}
    user = users[0]
    now = timezone.now()
    if user.login_time is None:
        login_window = Setting.objects.get(key='login_window').value_int
        start_time = user.task_start
        end_time = start_time + datetime.timedelta(seconds=login_window)
        if start_time > now:
            return {'status': 'too early', 'user': user}
        elif end_time < now:
            return {'status': 'too late', 'user': user}
        else:
            return {'status': 'ok', 'user': user}
    else:
        task_time = Setting.objects.get(key='task_time').value_int
        start_time = user.login_time
        end_time = start_time + datetime.timedelta(seconds=task_time)
        if end_time < now:
            return {'status': 'time is up', 'user': user}
        else:
            remaining_time = (end_time - now).total_seconds()
            return {'status': 'ok', 'user': user, 'remaining_time': remaining_time}


def login(request):
    if request.method == 'POST':
        req = json.loads(request.body.decode('utf-8'))
        auth = authenticate(req['cc'])
        if auth['status'] == 'ok':
            if auth['user'].login_time is None:
                auth['user'].login_time = timezone.now()
                auth['user'].save()
                auth = authenticate(req['cc'])
            return HttpResponse(json.dumps({
                'status': auth['status'],
                'username': auth['user'].full_name,
                'remaining_time': auth['remaining_time']
            }))
        else:
            return HttpResponse(json.dumps({'status': auth['status']}))
