# Web Safe Cracker


## Deployment

The repo can be deployed as a Docker image on various clouds. The current configuration is for Azure with stack xy. 

```
python manage.py collectstatic  # in backend
npm run build                   # in frontend
docker build -t websafecracker -f <Dockerfile> .
```
