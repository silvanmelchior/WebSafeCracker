import os
from django.http import HttpResponse


# Load files into ram
base_dir = os.path.dirname(os.path.abspath(__file__))
files_dir = os.path.join(base_dir, 'files')

with open(os.path.join(files_dir, 'index.html'), 'r') as f:
    index_content = f.read()

with open(os.path.join(files_dir, 'favicon.ico'), 'rb') as f:
    favicon_content = f.read()


# Views
def index(request):
    return HttpResponse(index_content)


def favicon(request):
    return HttpResponse(favicon_content, content_type='image/ico')
