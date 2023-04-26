#!/bin/bash

# Define container name, port number, and volume name
CONTAINER_NAME="nginx-product"
# Must be as in nginx.conf
PORT_NUMBER="80"
RELATIVE_CONFIG_PATH="./nginx.conf"

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
    # If container doesn't exist, create and set up it
    docker run --name $CONTAINER_NAME -p $PORT_NUMBER:$PORT_NUMBER -v /${PWD}/${RELATIVE_CONFIG_PATH}:/etc/nginx/nginx.conf:ro -d nginx
    sleep 5s
fi
