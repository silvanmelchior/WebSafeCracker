from django.urls import path
from . import views


urlpatterns = [
    path('login', views.login, name='login'),
    path('task', views.task_list, name='task_list'),
    path('task_demo.json', views.task_list_demo_mode, name='task_list_demo_mode'),
    path('task/<int:task_id>', views.task_get, name='task_get'),
    path('task/<int:task_id>/enter_code', views.task_enter_code, name='task_enter_code'),
]
