const log4js = require("log4js");

module.exports =
{ of:
  function(s){
      return log4js.getLogger(s)
  }
, configure:
  function(cfg) {
      log4js.configure( cfg )
      return this
  }
}
