var request = require("request")

var opts = require("../make-opts")([
  {name: "host", alias: "s", description: "Node RPC address", required: true},
  {name: "address", alias: "a", description: "Address to set as an author", required: true}
], {
  header: "PoA cluster: set author",
  content: "Set an address to be an author on a node"
})

request.post("http://"+opts.host, {
  json: {
    jsonrpc: "2.0",
    method: "parity_setAuthor",
    id:1,
    params: [opts.address]
  }
}, (err, res, body)=>{
  if(err) throw err

  console.log("OK")
})
