#IMPORTANT INFO!!!!
#AFTER script execution add line '127.0.0.1 receipt_1 receipt_2 receipt_3' to your hosts file
#/etc/hosts in Mac OS, c:\Windows\System32\Drivers\etc\hosts in Windows

CONTAINER_NAME_1="receipt_1"
CONTAINER_NAME_2="receipt_2"
CONTAINER_NAME_3="receipt_3"
PORT_NUMBER_1="9052"
PORT_NUMBER_2="9152"
PORT_NUMBER_3="9252"
VOLUME_NAME_1="ecommerce-receipt-volume-1"
VOLUME_NAME_2="ecommerce-receipt-volume-2"
VOLUME_NAME_3="ecommerce-receipt-volume-3"
NETWORK_NAME="receipt_db_cluster"
REPLICASET_NAME="receiptReplicaSet"
# Check if volume exists
if [ ! "$(docker volume ls | grep $VOLUME_NAME_1)" ]; then
    # If volume doesn't exist, create it
    docker volume create $VOLUME_NAME_1
fi
# Check if volume exists
if [ ! "$(docker volume ls | grep $VOLUME_NAME_2)" ]; then
    # If volume doesn't exist, create it
    docker volume create $VOLUME_NAME_2
fi
# Check if volume exists
if [ ! "$(docker volume ls | grep $VOLUME_NAME_3)" ]; then
    # If volume doesn't exist, create it
    docker volume create $VOLUME_NAME_3
fi



docker network create $NETWORK_NAME



# Check if container already exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME_1)" ]; then
    # If container exists, start it
    docker start $CONTAINER_NAME_1
else
    # If container doesn't exist, create it and set up the required document
    docker run --name $CONTAINER_NAME_1 -v $VOLUME_NAME_1:/data/db -d --net $NETWORK_NAME -p $PORT_NUMBER_1:$PORT_NUMBER_1 mongo mongod --replSet $REPLICASET_NAME --port $PORT_NUMBER_1
fi
sleep 5




# Check if container already exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME_2)" ]; then
    # If container exists, start it
    docker start $CONTAINER_NAME_2
else
    # If container doesn't exist, create it and set up the required document
    docker run --name $CONTAINER_NAME_2 -v $VOLUME_NAME_2:/data/db -d --net $NETWORK_NAME -p $PORT_NUMBER_2:$PORT_NUMBER_2 mongo mongod --replSet $REPLICASET_NAME --port $PORT_NUMBER_2
fi
sleep 5




# Check if container already exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME_3)" ]; then
    # If container exists, start it
    docker start $CONTAINER_NAME_3
else
    # If container doesn't exist, create it and set up the required document
    docker run --name $CONTAINER_NAME_3 -v $VOLUME_NAME_3:/data/db -d --net $NETWORK_NAME -p $PORT_NUMBER_3:$PORT_NUMBER_3 mongo mongod --replSet $REPLICASET_NAME --port $PORT_NUMBER_3
fi
sleep 5


#docker exec -it $CONTAINER_NAME_1 bash -c 'sleep 5s; echo "db.users.insertOne({ uuid: \"00000000-0000-0000-0000-000000000001\", email: \"john@example.com\", name: \"John Doe\", role: \"Buyer\", password: \"password123\" }); " | mongosh'

#config = {"_id" : "docker-rs", "members" : [{"_id" : 0,"host" : "mongo1:9042"},{"_id" : 1,"host" : "mongo2:9142"},{"_id" : 2,"host" : "mongo3:9242"}]}
#rs.initiate(config)
docker exec -it $CONTAINER_NAME_1 mongosh --port $PORT_NUMBER_1 --eval "rs.initiate({
 _id: \"receiptReplicaSet\",
 members: [
   {_id: 0, host: \"$CONTAINER_NAME_1:$PORT_NUMBER_1\"},
   {_id: 1, host: \"$CONTAINER_NAME_2:$PORT_NUMBER_2\"},
   {_id: 2, host: \"$CONTAINER_NAME_3:$PORT_NUMBER_3\"}
 ]
})"

docker exec -it $CONTAINER_NAME_1 mongosh --port $PORT_NUMBER_1 --eval "rs.status()"


