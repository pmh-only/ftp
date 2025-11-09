FROM alpine:latest

RUN apk add --no-cache rsync bash openssl

WORKDIR /app

USER 1000:1000

COPY --chown=1000:1000 ./*.sh /app/

ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
