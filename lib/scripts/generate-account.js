var request = require("request"),
    _ = require("lodash")

var opts = require("../make-opts")([
  {name: "host", alias: "s", description: "Node RPC address", required:true},
  {name: "phrase", alias: "r", description: "Phrase used for generating a key", required:true},
  {name: "password", alias: "p", description: "Password", required:true}
], {
  header: "PoA cluster: generate account",
  content: "Generate a single account from a phrase on a target node"
})

request.post("http://"+opts.host, {
  json: {
    jsonrpc: "2.0",
    method: "parity_newAccountFromPhrase",
    id:1,
    params: [opts.password, opts.phrase]
  }
}, (err, res, body)=>{
  if(err) throw err

  console.log(body.result)
})
