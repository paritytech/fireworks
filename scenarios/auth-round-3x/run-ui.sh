#!/bin/bash

# being able to run docker commands on swarm networks will make things simpler

SHARED_DIR=/home/shared
AUTH_NAMES="poa0 poa1 poa2"
CHAIN_URL=https://raw.githubusercontent.com/ethcore/poa-cluster-tools/master/scenarios/auth-round-3x/chain.json

declare -A ADDRESS
ADDRESS[poa0]=0x0073e5ffafe3a2974a407b04b730278cf5a6a36c
ADDRESS[poa1]=0x009c52a373df8621aa3712dccdc1896a2108aba0
ADDRESS[poa2]=0x0066c20558176bcbc8dcdabb7b7093e4b1dd4abe

function wait_for_state(){
  until [  $(docker inspect -f {{.Status.State}} $1) == $2 ]; do
    $3
    sleep 1
  done
}

function join_by { local d=$1; shift; echo -n "$1"; shift; printf "%s" "${@/#/$d}"; }


rpc_port=8545
dapps_port=8080
ui_port=8180

for name in $AUTH_NAMES
do
  docker service create \
         --name $name \
         --network poa_cluster \
         -p $rpc_port:8545 \
         -p $ui_port:8180 \
         -p $dapps_port:8080 \
         jesuscript/parity-master /bin/bash -c "\
         curl -o /root/chain.json $CHAIN_URL && \
         mkdir -p /root/.parity/signer/ && \
         parity \
         --chain /root/chain.json \
         --jsonrpc-interface all \
         --jsonrpc-hosts all \
         --jsonrpc-apis web3,eth,net,personal,parity,parity_set,traces,rpc,parity_accounts \
         --ui-no-validation \
         --ui-interface 0.0.0.0 \
         --dapps-interface 0.0.0.0 \
         --dapps-hosts all"

  
  rpc_port=$(($rpc_port+1))
  ui_port=$(($ui_port+1))
  dapps_port=$(($dapps_port+1))
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
  auth_addr=$(fw rpc -m parity_newAccountFromPhrase -s $name:8545 -p $name,$name)
  fw rpc -m personal_unlockAccount -p $auth_addr,$name,0 -s $name:8545
  fw rpc -m parity_setAuthor -p $auth_addr -s $name:8545
done

names_arg=""

fw connect-nodes -s $(join_by :8545, $AUTH_NAMES):8545

docker service rm poa_conf

