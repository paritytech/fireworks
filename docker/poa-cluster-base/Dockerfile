FROM ubuntu:xenial

RUN apt-get update && apt-get install -y curl git jq apt-utils build-essential python g++ gcc libssl-dev

RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get update && apt-get install nodejs -y

#RUN npm config set registry http://registry.npmjs.org/
RUN npm install -g pm2 node-gyp

ENV DUMMY 1
RUN git clone https://github.com/ethcore/poa-cluster-tools.git
RUN cd poa-cluster-tools && npm install && npm install -g


COPY run-parity.sh /root/
