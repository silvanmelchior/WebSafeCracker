import csv
from io import StringIO
from django import forms
from django.urls import path
from django.contrib import admin, messages
from django.shortcuts import redirect, render
from django.utils.dateparse import parse_datetime

from .models import Setting, Competitor, Task, Answer, Attachment


admin.site.register(Setting)
admin.site.register(Task)
admin.site.register(Answer)
admin.site.register(Attachment)


class CsvImportForm(forms.Form):
    csv_file = forms.FileField()


@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):

    ordering = ('competitor_id',)

    def get_urls(self):
        my_urls = [
            path('import-csv/', self.import_csv),
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
