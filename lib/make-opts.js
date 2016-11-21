var commandLineArgs = require('command-line-args'),
    commandLineUsage = require('command-line-usage'),
    _ = require("lodash")


module.exports = function(defOpt, usageHead){
  var opts = commandLineArgs(defOpt.concat({
    name: "help",
    alias: "h",
    description: "Print usage"
  }))
  
  if(opts.help || _(defOpt).filter("required").filter((o)=> !opts[o.name]).size()){
    console.log(commandLineUsage([
      usageHead,
      {
        optionList: defOpt
      }
    ]))

    process.exit(-1)
  }

  return opts
}
