#!/usr/bin/env bash

python -u manage.py migrate

envsubst '${SERVER_NAME}' < /etc/nginx/sites-available/default.template > /etc/nginx/sites-available/default
service nginx start

gunicorn -b :8000 backend.wsgi
