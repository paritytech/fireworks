var request = require("request"),
    _ = require("lodash")

var opts = require("../make-opts")([
  {name: "host", alias: "s", description: "Node RPC address", required: true},
  {name: "address", alias: "a", description: "Address to unlock", required: true},
  {name: "password", alias: "p", description: "Password for the account", required: true}
], {
  header: "PoA cluster: unlock account",
  content: "Unlock target account"
})

request.post("http://"+opts.host, {
  json: {
    jsonrpc: "2.0",
    method: "personal_unlockAccount",
    id:1,
    params: [opts.address, opts.password, 0]
  }
}, (err, res, body)=>{
  if(err) throw err
  
  console.log(body)
})
