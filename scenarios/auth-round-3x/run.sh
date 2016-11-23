#!/bin/bash

SHARED_DIR=/home/shared
AUTH_NAMES="poa0 poa1 poa2"

cp ./chain.json $SHARED_DIR/chain.json

for name in $AUTH_NAMES
do
	docker service create --name $name --network poa_cluster --mount type=bind,target=/root/chain.json,source=$SHARED_DIR/chain.json jesuscript/parity-master parity --chain /root/chain.json --jsonrpc-interface all --jsonrpc-hosts all --jsonrpc-apis web3,eth,net,personal,parity,parity_set,traces,rpc,parity_accounts
done

for name in $AUTH_NAMES
do
	wait_till_running $name
done


echo All Done!

function wait_till_running(){
	until [[ "$( docker service ps $1 | grep Running )"]]; do
		sleep 1
	done
}

