FROM ubuntu:16.04

RUN apt-get update
RUN apt-get install curl git jq

RUN curl -sL https://deb.nodesource.com/setup_6.x | -E bash -
RUN apt-get update && apt-get install nodejs -y

RUN npm install -g pm2 

RUN git clone https://github.com/ethcore/poa-cluster-tools.git
RUN cd poa-cluster-tools
RUN npm install -g

COPY run-parity.sh $HOME/
