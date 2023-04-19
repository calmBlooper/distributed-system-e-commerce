#!/bin/bash

# Define container name, port number, and volume name
CONTAINER_NAME="ecommerce-users-db"
PORT_NUMBER="27017"
VOLUME_NAME="ecommerce-users-volume"

# Check if volume exists
if [ ! "$(docker volume ls | grep $VOLUME_NAME)" ]; then
    # If volume doesn't exist, create it
    docker volume create $VOLUME_NAME
fi

# Check if container already exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    # If container exists, start it
    docker start $CONTAINER_NAME
else
    # If container doesn't exist, create it and set up the required document
    docker run --name $CONTAINER_NAME -p $PORT_NUMBER:$PORT_NUMBER -v $VOLUME_NAME:/data/db -d mongo
    sleep 5s
    docker exec -it $CONTAINER_NAME bash -c 'sleep 5s; echo "db.users.insertOne({ uuid: \"00000000-0000-0000-0000-000000000001\", email: \"john@example.com\", name: \"John Doe\", role: \"Buyer\", password: \"password123\" }); " | mongosh'
    docker exec -it $CONTAINER_NAME bash -c 'sleep 5s; echo "db.users.find()" | mongosh'
    docker exec -it $CONTAINER_NAME bash -c 'sleep 5s; echo "exit; " | mongosh'
fi
