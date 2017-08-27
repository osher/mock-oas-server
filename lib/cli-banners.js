const assign = Object.assign
const format = require('util').format
const figlet = require('figlet')

const ERROR = figlet.textSync('OUCH')
const FATAL = figlet.textSync('FATAL')
const UP    = figlet.textSync('/\\')
const BYE   = figlet.textSync('\\/')
const formatErr = (banner, err) => format(
  '\n%s\n', 
  banner, 
  assign({ Error: err.stack.replace(/\\/g,"/").split("\n") }, err)
)

module.exports =  (log) => ({
  hello: ()    => log.info(`\n${figlet.textSync('OASM')}\nOpen API Server Mocker`),
  up:    address => log.info('server started\n%s\n', UP, address),
  bye:   (sig) => log.info('Accepted signal: %s\n%s', sig, BYE),  
  error: (err) => log.error( formatErr(ERROR, err) ),
  fatal: (err) => log.fatal( formatErr(FATAL, err) )
})
