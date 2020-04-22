from django.db import models
from ckeditor.fields import RichTextField


class Setting(models.Model):
    key = models.CharField(max_length=200, unique=True)
    value_str = models.CharField(max_length=200, blank=True)
    value_int = models.IntegerField(blank=True, null=True)
    value_dec = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True)

    def __str__(self):
        return self.key


class Competitor(models.Model):
    full_name = models.CharField(max_length=200)
    competitor_id = models.IntegerField()                               # SwissMem id
    competitor_code = models.CharField(max_length=200, unique=True)     # login code
    login_time = models.DateTimeField(blank=True, null=True)            # null if not logged in yet
    task_start = models.DateTimeField()

    def __str__(self):
        return str(self.competitor_id) + ': ' + str(self.full_name)


class Task(models.Model):
    nr = models.IntegerField()
    enabled = models.BooleanField()
    title = models.CharField(max_length=200)
    description = RichTextField()
    points = models.DecimalField(max_digits=5, decimal_places=1)
    code = models.CharField(max_length=100)

    def __str__(self):
        return str(self.nr) + ': ' + str(self.title)


class Answer(models.Model):
    competitor = models.ForeignKey(Competitor, on_delete=models.PROTECT)
    task = models.ForeignKey(Task, on_delete=models.PROTECT)
    code = models.CharField(max_length=100)
    time = models.DateTimeField()

    def __str__(self):
        return str(self.competitor) + ': ' + str(self.code)


class Attachment(models.Model):
    file = models.FileField()

    def __str__(self):
        return self.file.name
