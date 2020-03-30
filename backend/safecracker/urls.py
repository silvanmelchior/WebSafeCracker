from django.urls import path
from . import views


urlpatterns = [
    path('login', views.login, name='login'),
    path('task', views.task_list, name='task_list'),
    path('task/<int:task_id>', views.task_get, name='task_get'),
]
