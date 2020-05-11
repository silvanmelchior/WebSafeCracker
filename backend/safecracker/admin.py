import csv
import pytz
import decimal
import datetime
from io import StringIO
from django import forms
from django.urls import path
from django.conf import settings
from django.http import HttpResponse
from django.contrib import admin, messages
from django.shortcuts import redirect, render, get_object_or_404
from django.utils.dateparse import parse_datetime

from .models import Setting, Competitor, Task, TaskView, Answer, Attachment


admin.site.register(TaskView)
admin.site.register(Attachment)


class CsvImportForm(forms.Form):
    csv_file = forms.FileField()


def datetime_to_str(datetime):
    return datetime.astimezone(pytz.timezone(settings.TIME_ZONE)).strftime('%Y-%m-%d %H:%M:%S')


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):

    ordering = ('nr',)


@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):

    ordering = ('key',)


@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):

    ordering = ('competitor_id',)

    def get_urls(self):
        my_urls = [
            path('import-csv/', self.import_csv),
            path('<int:competitor_id>/change/export-csv/', self.export_csv)
        ]
        return my_urls + super().get_urls()

    def import_csv(self, request):
        if request.method == 'POST':
            file = request.FILES['csv_file'].read().decode('utf-8')
            reader = csv.reader(StringIO(file))
            next(reader)

            error = False
            for row in reader:
                competitor = Competitor()
                if len(row) != 4:
                    self.message_user(request, 'Wrong number of fields', level=messages.ERROR)
                    error = True
                    break
                try:
                    competitor.competitor_id = int(row[0])
                except ValueError:
                    self.message_user(request, 'Id not integer', level=messages.ERROR)
                    error = True
                    break
                competitor.full_name = row[1]
                if len(competitor.full_name) == 0:
                    self.message_user(request, 'Empty name', level=messages.ERROR)
                    error = True
                    break
                try:
                    competitor.task_start = parse_datetime(row[2])
                except ValueError:
                    self.message_user(request, 'Invalid date format', level=messages.ERROR)
                    error = True
                    break
                competitor.competitor_code = row[3]
                if len(competitor.competitor_code) == 0:
                    self.message_user(request, 'Empty code', level=messages.ERROR)
                    error = True
                    break
                if len(Competitor.objects.filter(competitor_code=competitor.competitor_code)) > 0:
                    self.message_user(request, 'Non-unique code', level=messages.ERROR)
                    error = True
                    break

                competitor.save()

            if not error:
                self.message_user(request, 'CSV file imported successfully')

            return redirect('..')

        context = {'form': CsvImportForm()}
        return render(request, 'admin/csv_form.html', context)

    def export_csv(self, request, competitor_id):
        competitor = get_object_or_404(Competitor, pk=competitor_id)

        answers = list(competitor.answer_set.filter(task__enabled=True))
        answers = [(answer.time, [
            datetime_to_str(answer.time),
            'Enter Code',
            str(answer.task),
            answer.code,
            'Correct Code' if answer.code == answer.task.code else 'Wrong Code'
        ]) for answer in answers]

        views = list(competitor.taskview_set.filter(task__enabled=True))
        views = [(view.time, [
            datetime_to_str(view.time),
            'View Task',
            str(view.task)
        ]) for view in views]

        task_time = Setting.objects.get(key='task_time').value_int
        start_time = competitor.login_time
        end_time = start_time + datetime.timedelta(seconds=task_time)
        logins = [
            (start_time, [datetime_to_str(start_time), 'Login']),
            (end_time, [datetime_to_str(end_time), 'End']),
        ]

        actions = answers + views + logins
        actions.sort()

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment;' \
            f'filename="{competitor.competitor_id} {competitor.full_name} Actions.csv"'
        writer = csv.writer(response)

        for action_time, str_list in actions:
            writer.writerow(str_list)

        return response


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):

    def get_urls(self):
        my_urls = [
            path('export-csv/', self.export_csv)
        ]
        return my_urls + super().get_urls()

    def export_csv(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="points.csv"'

        tasks = list(Task.objects.filter(enabled=True).order_by('nr'))
        competitors = list(Competitor.objects.all().order_by('competitor_id'))
        fail_penalty = Setting.objects.get(key='fail_penalty').value_dec
        task_stats = [{'-': 0, 'S': 0, 'S*': 0, 'T': 0, 'F': 0} for _ in tasks]

        writer = csv.writer(response)
        writer.writerow(['', ''] + ['Task ' + str(task.nr) for task in tasks] + ['Total'])
        for competitor in competitors:
            points = decimal.Decimal(0)
            row = [str(competitor.competitor_id), competitor.full_name]
            for i, task in enumerate(tasks):
                answers = task.answer_set.filter(competitor=competitor).order_by('time')
                if len(answers) == 0:
                    state = '-'
                else:
                    last_answer = list(answers)[-1]
                    if last_answer.code == task.code:
                        if len(answers) == 1:
                            state = 'S'
                        else:
                            state = 'S*'
                        points += task.points
                    else:
                        if len(answers) == 1:
                            state = 'T'
                        else:
                            state = 'F'
                            points -= fail_penalty
                row.append(state)
                task_stats[i][state] += 1
            row.append(str(points))
            writer.writerow(row)

        writer.writerow([])
        for state in ['-', 'S', 'S*', 'T', 'F']:
            writer.writerow(['Total', state] + [str(task_stats[i][state]) for i, _ in enumerate(tasks)])

        return response
