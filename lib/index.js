const _ = require("lodash"),
      path = require("path"),
      fs = require("fs")


module.exports = function(name){
  var scriptsDir = path.join(__dirname, "scripts"),
      scripts = _.map(fs.readdirSync(scriptsDir), (f) => f.replace(/.js$/, ''))

  ;(_.reduce(scripts, (ob, name) => {
    ob[name] = function(){
      require("./scripts/"+name)
    }

    return ob
  }, {})[name] || (() => {
    console.error("Available commands:", scripts.join(", "))
  }))()
}
