FROM ethcore/poa-cluster-base

# install rustup
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# rustup directory
ENV PATH /root/.cargo/bin:$PATH

# show backtraces
ENV RUST_BACKTRACE 1

# show tools
RUN rustc -vV && \
cargo -V && \
gcc -v &&\
g++ -v

ENV parity_build_dir /root/parity

RUN git clone https://github.com/ethcore/parity.git $parity_build_dir && \
        cd $parity_build_dir && \
        git checkout auth-round && \
        git pull && \
        cargo build --release --verbose

RUN ln -s $parity_build_dir/target/release/parity /usr/bin/parity

EXPOSE 8080 8545 8180 30303/udp 30303

COPY run-parity.sh /root/
RUN chmod +x /root/run-parity.sh
