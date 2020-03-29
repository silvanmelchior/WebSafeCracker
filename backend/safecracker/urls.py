from django.urls import path
from . import views


urlpatterns = [
    path('test', views.api_test, name='test'),
]
