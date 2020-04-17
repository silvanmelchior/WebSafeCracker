#!/usr/bin/env bash

python -u manage.py migrate

service nginx start
gunicorn -b :8000 backend.wsgi
