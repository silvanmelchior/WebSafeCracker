#!/usr/bin/env bash

python -u manage.py migrate

service nginx start
gunicorn backend.wsgi
