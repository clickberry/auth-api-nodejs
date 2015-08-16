#!/bin/bash
set -e

# set env variables
if [ -n "$MONGO_PORT_27017_TCP_ADDR" ] && [ -n "$MONGO_PORT_27017_TCP_PORT" ]; then
  export mongo_connection="mongodb://${MONGO_PORT_27017_TCP_ADDR}:${MONGO_PORT_27017_TCP_PORT}/auth"
fi

echo "USING MONGO CONNECTION: ${mongo_connection}"

# execute nodejs application
exec /nodejs/bin/npm start