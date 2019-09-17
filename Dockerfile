FROM nginx
LABEL name="vue-front"
LABEL version="1.1"
COPY ./dist /usr/share/nginx/html
COPY ./vue-front.conf  /ect/nginx/conf.d
EXPOSE 80