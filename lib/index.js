const _ = require("lodash")


module.exports = function(name){
  var scripts = ["init"]
  
  ;(_.reduce(scripts, (ob, name) => {
    ob[name] = function(){
      require("./scripts/"+name)
    }
    
    return ob
  }, {})[name] || (() => {
    console.error("Available commands:", scripts.join(", "))
  }))()
}
