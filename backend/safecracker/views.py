import json
import decimal
import datetime
from django.conf import settings
from django.http import HttpResponse
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from .models import Competitor, Setting, Task, Answer


def _authenticate(cc):
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
        try:
            req = json.loads(request.body.decode('utf-8'))
        except json.decoder.JSONDecodeError:
            return HttpResponse('invalid request')
        auth = _authenticate(req['cc'])
        if auth['status'] == 'ok':
            if auth['competitor'].login_time is None:
                auth['competitor'].login_time = timezone.now()
                auth['competitor'].save()
                auth = _authenticate(req['cc'])
            return HttpResponse(json.dumps({
                'status': auth['status'],
                'name': auth['competitor'].full_name,
                'remaining_time': auth['remaining_time']
            }))
        else:
            return HttpResponse(json.dumps({'status': auth['status']}))
    else:
        return HttpResponse('invalid request')


def _get_competitor_get(request):
    if request.method == 'GET':
        if 'cc' in request.GET:
            auth = _authenticate(request.GET['cc'])
            if auth['status'] == 'ok':
                return auth['competitor']
    raise PermissionDenied


def _get_competitor_post(request):
    if request.method == 'POST':
        try:
            req = json.loads(request.body.decode('utf-8'))
        except json.decoder.JSONDecodeError:
            raise PermissionDenied
        if 'cc' in req:
            auth = _authenticate(req['cc'])
            if auth['status'] == 'ok':
                return auth['competitor']
    raise PermissionDenied


def _get_task_state(task, competitor):
    answers = task.answer_set.filter(competitor=competitor).order_by('time')
    if len(answers) == 0:
        return 'open'
    last_answer = list(answers)[-1]
    if last_answer.code == task.code:
        return 'solved'
    if len(answers) == 1:
        return 'second chance'
    return 'blocked'


def task_list(request):
    competitor = _get_competitor_get(request)
    tasks = Task.objects.filter(enabled=True).order_by('nr')
    fail_penalty = Setting.objects.get(key='fail_penalty').value_dec
    tasks_list = []
    points = decimal.Decimal(0)
    for task in tasks:
        state = _get_task_state(task, competitor)
        if state == 'solved':
            points += task.points
        elif state == 'blocked':
            points -= fail_penalty
        tasks_list.append({
            'pk': task.pk,
            'nr': task.nr,
            'title': task.title,
            'state': state,
            'points': float(task.points)
        })
    return HttpResponse(json.dumps({'tasks': tasks_list, 'points': float(points)}))


def task_get(request, task_id):
    competitor = _get_competitor_get(request)
    task = get_object_or_404(Task, pk=task_id, enabled=True)
    state = _get_task_state(task, competitor)
    response = {
        'nr': task.nr,
        'title': task.title,
        'description': task.description,
        'state': state,
        'media_url': settings.MEDIA_URL
    }
    return HttpResponse(json.dumps(response))


def task_enter_code(request, task_id):
    competitor = _get_competitor_post(request)
    task = get_object_or_404(Task, pk=task_id, enabled=True)
    state = _get_task_state(task, competitor)
    if state == 'solved':
        return HttpResponse('already solved')
    if state == 'blocked':
        return HttpResponse('already blocked')
    req = json.loads(request.body.decode('utf-8'))
    task.answer_set.create(competitor=competitor, code=req['code'], time=timezone.now())
    state = _get_task_state(task, competitor)
    return HttpResponse(state)
