#!/usr/bin/env bash

python -u manage.py migrate

service ssh start

envsubst '${SERVER_NAME}' < /etc/nginx/sites-available/default.template > /etc/nginx/sites-available/default
service nginx start

gunicorn --timeout 600 -b :8000 backend.wsgi
