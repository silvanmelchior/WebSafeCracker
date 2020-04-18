from .settings import *


DEBUG = False

ALLOWED_HOSTS = [os.environ['ALLOWED_HOST']]

SECRET_KEY = os.environ['SECRET_KEY']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': os.environ['DB_HOST'],
        'PORT': os.environ['DB_PORT'],
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
        'NAME': os.environ['DB_NAME'],
        'CONN_MAX_AGE': 60
    }
}

DEFAULT_FILE_STORAGE = 'backend.custom_storage.custom_azure.AzureMediaStorage'
MEDIA_URL = os.environ['MEDIA_URL']
