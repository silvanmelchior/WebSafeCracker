from django.http import HttpResponse


def api_test(_):
    return HttpResponse("API WORKS")
