FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY http.conf.d /etc/nginx/http.conf.d
COPY stream.conf.d /etc/nginx/stream.conf.d
COPY dist/ /app/
