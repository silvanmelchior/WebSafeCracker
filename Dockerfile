FROM python:3.7-buster

WORKDIR /opt/app
EXPOSE 80 2222

RUN apt-get update && apt-get install nginx gettext-base openssh-server -y --no-install-recommends

RUN echo "root:Docker!" | chpasswd
COPY docker-sshd.conf /etc/ssh/sshd_config

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
