#!/bin/sh
mongo --eval "
    db.createUser({
      user: '$MONGODB_USERNAME',
      pwd: '$MONGODB_PASSWORD',
      roles: ['readWrite'],
    });" -- "$MONGO_INITDB_DATABASE"
