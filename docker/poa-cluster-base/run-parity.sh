#!/bin/bash

# This script is called by poa_cluster_start_node to launch a parity node.
# Feel free to overwrite this file with your own

ADDRESS=$(jq .address ~/.parity/keys/key.json -r)

parity --chain $HOME/chain.json --author ADDRESS --unlock ADDRESS --password $HOME/password.txt --jsonrpc-interface all --jsonrpc-hosts all --no-dapps --no-signer
