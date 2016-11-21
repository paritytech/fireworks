var request = require("request")


var opts = require("../make-opts")([
  {name: "host", alias: "s", description: "Node RPC address (required)", required:true},
  {name: "method", alias: "m", description: "RPC method (required)", required: true},
  {name: "params", alias: "p",
   description: "Comma-separated list of Params to send with the RPC request"}
], {
  header: "PoA cluster: rpc",
  content: "Send an RPC request to a target node"
})


request.post("http://"+opts.host, {
  json: {
    jsonrpc: "2.0",
    id: 1,
    method: opts.method,
    params: opts.params && opts.params.split(",")
  }
}, (err, res, body) => {
  if(err) throw err
  if(body.error) {
    console.error(body.error)
  }else{
    console.log(body.result)
  }
})
