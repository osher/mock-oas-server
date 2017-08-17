const assign = Object.assign
const format = require('util').format
const figlet = require('figlet')

const ERROR = figlet.textSync('OUCH')
const FATAL = figlet.textSync('FATAL')
const formatErr = (banner, err) => format(
  '\n%s\n', 
  banner, 
  assign({ Error: err.stack.replace(/\\/g,"/").split("\n") }, err)
)

module.exports =  (log) => ({
  hello: ()    => log.info(`\n${figlet.textSync('OASM')}\nOpen API Server Mocker`),
  bye:   (sig) => log.info('Accepted signal: ', sig),
  error: (err) => log.error( formatErr(ERROR, err) ),
  fatal: (err) => log.fatal( formatErr(FATAL, err) )
})
