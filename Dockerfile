FROM python:3.7-buster

WORKDIR /opt/app

RUN apt-get update && apt-get install nginx gettext-base -y
RUN ln -sf /dev/stderr /var/log/nginx/error.log
COPY docker-nginx.conf /etc/nginx/sites-available/default.template

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend .
COPY frontend/build/static static_prod
COPY frontend/build/index.html frontend_prod/files
COPY frontend/build/favicon.ico frontend_prod/files

COPY docker-start.sh .
CMD ["./docker-start.sh"]
