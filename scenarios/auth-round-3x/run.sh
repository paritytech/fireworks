#!/bin/bash

# being able to run docker commands on swarm networks will make things simpler

SHARED_DIR=/home/shared
AUTH_NAMES="poa0 poa1 poa2"

declare -A ADDRESS
ADDRESS[poa0]=0x0073e5ffafe3a2974a407b04b730278cf5a6a36c
ADDRESS[poa1]=0x009c52a373df8621aa3712dccdc1896a2108aba0
ADDRESS[poa2]=0x0066c20558176bcbc8dcdabb7b7093e4b1dd4abe

CHAIN_URL=https://raw.githubusercontent.com/ethcore/poa-cluster-tools/master/scenarios/auth-round-3x/chain.json


function wait_for_state(){
  until [  $(docker inspect -f {{.Status.State}} $1) == $2 ]; do
    $3
    sleep 1
  done
}

function join_by { local d=$1; shift; echo -n "$1"; shift; printf "%s" "${@/#/$d}"; }

docker run \
			 --rm \
			 -v $SHARED_DIR/chain.json:/root/chain.json \
			 ethcore/poa-cluster-base curl -o /root/chain.json $CHAIN_URL

for name in $AUTH_NAMES
do
  docker service create \
				 --name $name \
				 --network poa_cluster \
				 --mount type=bind,target=/root/chain.json,source=$SHARED_DIR/chain.json \
				 jesuscript/parity-master parity \
				 --chain /root/chain.json \
				 --jsonrpc-interface all \
				 --jsonrpc-hosts all \
				 --jsonrpc-apis web3,eth,net,personal,parity,parity_set,traces,rpc,parity_accounts
done

echo "Waiting for nodes to start"

for name in $AUTH_NAMES
do
  wait_for_state $name "running" "docker service ls"
done

echo "Enable authorities"

conf_cmd=""

for name in $AUTH_NAMES
do
  sub_cmd="\
poa_cluster_tools rpc -m parity_newAccountFromPhrase -s $name:8545 -p $name,$name && \
poa_cluster_tools rpc -m personal_unlockAccount -p ${ADDRESS[$name]},$name,0 -s $name:8545 && \
poa_cluster_tools rpc -m parity_setAuthor -p ${ADDRESS[$name]} -s $name:8545"

  if [[ -n "$conf_cmd" ]]; then
    conf_cmd="$conf_cmd && $sub_cmd"
  else
    conf_cmd=$sub_cmd
  fi
done

conf_cmd="$conf_cmd && poa_cluster_tools connect-nodes -s $(join_by , $AUTH_NAMES)"

echo $conf_cmd

docker service create \
			 --name poa_conf \
			 --network poa_cluster \
			 --restart-condition none \
			 ethcore/poa-cluster-base $conf_cmd

wait_for_state poa_conf complete "docker service ps poa_conf"

docker service rm poa_conf


echo "All Done! Removing nodes."

for name in $AUTH_NAMES
do
  docker service rm $name
done


