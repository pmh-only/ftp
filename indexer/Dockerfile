FROM scratch

ARG TARGETARCH
ARG user=1000
ARG group=1000

USER $user:$group
WORKDIR /app

COPY backend/main-${TARGETARCH} ./main
COPY frontend/dist/ public/

ENTRYPOINT ["/app/main"]