var log4js = require("log4js")
  , cfg
  ;

module.exports =
{ of:
  function(s){
      return log4js.getLogger(s)
  }
, configure:
  function(cfg) {
      log4js.configure( cfg )
      if (cfg.levels && cfg.levels["[all]"])
          log4js.setGlobalLogLevel( cfg.levels["[all]"] )
      return this
  }
}
