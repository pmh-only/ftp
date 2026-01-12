FROM alpine:latest

RUN apk add --no-cache rsync

ENTRYPOINT [ "/usr/bin/rsync" ]
CMD [ "--daemon", "--no-detach", "--config=/etc/rsyncd.conf" ]
