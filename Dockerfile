FROM nginx:1.17.1
COPY build/ /usr/share/nginx/html/
EXPOSE 80