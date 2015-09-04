#!/bin/bash
set -e

# set env variables
if [ -n "$MONGO_PORT_27017_TCP_ADDR" ] && [ -n "$MONGO_PORT_27017_TCP_PORT" ]; then
  export MONGODB_CONNECTION="mongodb://${MONGO_PORT_27017_TCP_ADDR}:${MONGO_PORT_27017_TCP_PORT}/auth"
fi
echo "USING MONGO CONNECTION: ${MONGODB_CONNECTION}"

if [ -n "$NSQD_PORT_4150_TCP_ADDR" ] && [ -n "$NSQD_PORT_4150_TCP_PORT" ]; then
  export NSQD_ADDRESS="${NSQD_PORT_4150_TCP_ADDR}"
  export NSQD_PORT="${NSQD_PORT_4150_TCP_PORT}"
fi
echo "USING NSQD: ${NSQD_PORT_4150_TCP_ADDR}:${NSQD_PORT}"

# execute nodejs application
exec /nodejs/bin/npm start
