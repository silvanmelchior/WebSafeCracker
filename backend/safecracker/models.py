from django.db import models


class Setting(models.Model):
    key = models.CharField(max_length=200, unique=True)
    value_str = models.CharField(max_length=200, blank=True)
    value_int = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.key


class User(models.Model):
    full_name = models.CharField(max_length=200)
    competitor_id = models.IntegerField()                               # SwissMem id
    competitor_code = models.CharField(max_length=200, unique=True)     # login code
    login_time = models.DateTimeField(blank=True, null=True)            # null if not logged in yet
    task_start = models.DateTimeField()

    def __str__(self):
        return self.full_name