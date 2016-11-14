var commandLineArgs = require('command-line-args'),
    commandLineUsage = require('command-line-usage'),
    ejs = require("ejs"),
    fs = require("fs"),
    _ = require("lodash"),
    async = require("async"),
    keythereum = require("keythereum"),
    generatePassword = require("password-generator"),
    path = require("path"),
    vars = require("../../vars.json")


var defOpt = [
  {name: "number", alias: "n", type: Number, description: "Number of nodes (required)"},
  {name: "help", alias: "h",  description: "Print usage"},
  {name: "image", alias: "i", type: String, description: "Docker Image name (required)"},
  {name: "chainspec", alias: "c", type: String, description: "Chain spec file path",
   defaultValue: path.join(process.env.HOME, "chain.json")}
], opts = commandLineArgs(defOpt)

if(opts.help || !opts.number || !opts.image){
  console.log(commandLineUsage([{
    header: "PoA cluster: init",
    content: "Generate a script for initialising a PoA cluster"
  },{
    optionList: defOpt
  }]))
  
  process.exit(0)
}

var accounts = _.times(opts.number, (n)=>{
  var password = generatePassword(24,false),
      dk = keythereum.create({ keyBytes: 32, ivBytes: 16 })

  return {
    password,
    key: keythereum.dump(password,dk.privateKey,dk.salt,dk.iv)
  }
})



var chainSpec = JSON.stringify(JSON.parse(ejs.render(fs.readFileSync(opts.chainspec).toString(), {
  _,
  accounts
})))

var containerCmd = (i) => `poa_cluster_start_node `
      + `-c '${chainSpec}\' `
      + `-k '${JSON.stringify(accounts[i].key)}' `
      + `-p ${accounts[i].password}`,
    serviceCmd = (i) => `docker service create `
      + `--network ${vars.NETWORK_NAME} `
      + `--name ${vars.POA_NODE_NAME}-${i} `
      + `${opts.image} ${containerCmd(i)}`



console.log(
  ["#!/bin/bash",
   `docker network create ${vars.NETWORK_NAME} --driver overlay`]
    .concat(_.times(opts.number, serviceCmd).join("\n"))
    .concat([
      "\n\n",
      "# Edit and run this command to initialise your PoA cluster:",
      `# eval $(docker run --rm -v <path to chainspec>:${opts.chainspec} ethcore/parity-poa-base poa-cluster-init [OPTIONS])`
    ]).join("\n")
)





