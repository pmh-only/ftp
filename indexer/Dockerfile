FROM alpine AS backend

RUN apk add --no-cache go

COPY backend/ /app/

WORKDIR /app

ENV CGO_ENABLED=0
RUN go build -o /app/main

FROM alpine AS frontend

RUN apk add --no-cache nodejs pnpm

COPY frontend/ /app/

WORKDIR /app

RUN pnpm i
RUN pnpm build

FROM scratch AS runtime

ARG user=1000
ARG group=1000

USER $user:$group
WORKDIR /app

COPY --from=backend /app/main .
COPY --from=frontend /app/dist/ public/

ENTRYPOINT ["/app/main"]