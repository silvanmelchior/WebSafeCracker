import csv
import decimal
from io import StringIO
from django import forms
from django.urls import path
from django.http import HttpResponse
from django.contrib import admin, messages
from django.shortcuts import redirect, render
from django.utils.dateparse import parse_datetime

from .models import Setting, Competitor, Task, Answer, Attachment


admin.site.register(Setting)
admin.site.register(Task)
admin.site.register(Attachment)


class CsvImportForm(forms.Form):
    csv_file = forms.FileField()


@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):

    ordering = ('competitor_id',)

    def get_urls(self):
        my_urls = [
            path('import-csv/', self.import_csv)
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

        writer = csv.writer(response)
        writer.writerow([''] + ['Task ' + str(task.nr) for task in tasks])
        for competitor in competitors:
            points = decimal.Decimal(0)
            row = [competitor.full_name]
            for task in tasks:
                answers = task.answer_set.filter(competitor=competitor).order_by('time')
                if len(answers) == 0:
                    row.append('')
                else:
                    last_answer = list(answers)[-1]
                    if last_answer.code == task.code:
                        if len(answers) == 1:
                            row.append('S')
                        else:
                            row.append('S*')
                        points += task.points
                    else:
                        if len(answers) == 1:
                            row.append('T')
                        else:
                            row.append('F')
                            points -= fail_penalty
            row.append(str(points))
            writer.writerow(row)

        return response
