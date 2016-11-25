#!/bin/bash

docker service create --network poa_cluster --restart-condition none --name poa_conf --constraint 'node.role == manager' --mount type=bind,target=/var/run/docker.sock,source=/var/run/docker.sock --mount type=bind,target=/root/run.sh,source=/root/run.sh ethcore/fireworks /root/run.sh
