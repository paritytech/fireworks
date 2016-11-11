var commandLineArgs = require('command-line-args'),
    commandLineUsage = require('command-line-usage'),
    path = require("path"),
    fs = require("fs")

var defaults = {
  chainspecPath: path.join(process.env.HOME, "chain.json"),
  keyPath: path.join(process.env.HOME, ".parity", "keys"),
  passwordPath: path.join(process.env.HOME, "password.txt")
}

var defOpt = [
  {name: "help", alias: "h",  description: "Print usage"},
  {name:"chainspec", alias:"c", type: String, description: "Chain spec data (required)"},
  {name:"key", alias: "k", type: String, description: "Key data (required)"},
  {name:"password", alias:"p", type: String, description: "Password for the key (required)"},
  {name:"chainspec-path", type: String, defaultValue: defaults.chainspecPath,
   description: `Local chain spec file path (default: ${defaults.chainspecPath})`},
  {name:"key-path", type: String, defaultValue:defaults.keyPath,
   description: `Local key file path (default: ${defaults.keyPath})`},
  {name:"password-path", type:String, defaultValue: defaults.passwordPath,
   description: `Local password file path (default:${defaults.passwordPath})`}
], opts = commandLineArgs(defOpt)

if(opts.help || !opts.chainspec || !opts.key || !opts.password){
  console.log(commandLineUsage([
    {
      header: "PoA cluster: start node",
      content: "Configure and launch a node in a cluster"
    },
    {
      optionList: defOpt
    }
  ]))

  process.exit(0)
}

fs.writeFileSync(opts["chainspec-path"], JSON.stringify(JSON.parse(opts.chainspec), null, 2))
fs.writeFileSync(opts["key-path"], JSON.stringify(JSON.parse(opts.key), null, 2))
fs.writeFileSync(opts["password-path"], opts.password)
