from django.contrib import admin
from .models import Setting, Competitor, Task, Answer, Attachment


admin.site.register(Setting)
admin.site.register(Competitor)
admin.site.register(Task)
admin.site.register(Answer)
admin.site.register(Attachment)
