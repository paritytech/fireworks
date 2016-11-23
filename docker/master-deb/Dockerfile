FROM ubuntu:xenial

RUN apt-get update && apt-get install -y curl

ENV PARITY_DEB_URL http://d1h4xl4cr1h0mo.cloudfront.net/master/x86_64-unknown-linux-gnu/parity_1.5.0_amd64.deb

RUN curl -o parity.deb $PARITY_DEB_URL && \
    dpkg -i parity.deb && \
    rm parity.deb




