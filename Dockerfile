FROM google/nodejs-runtime
MAINTAINER Konstantin Altuhov <altuhov@clickberry.com>

# prepare env vars and run nodejs
RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]

EXPOSE 8080