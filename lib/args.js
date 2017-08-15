const path  = require('path')
const yargs =
  require('yargs').options(
    { s:
      { alias:    'spec'
      , describe: 'name of a requirable module(json, js or yaml) that returns the OAS document or a promise that resolves to OAS document. Relative paths are resolved relative to process.cwd()'
      }
    , p:
      { alias:    'port'
      , describe: 'the TCP port to bind the server, overrides whatever is found in the spec'
      }
    , l:
      { alias:    'logLevel'
      , describe: 'log level: DEBUG|INFO|WARN|ERROR|FATAL'
      , default:  'INFO'
      }
    , h:
      { alias:    'help'
      , describe: 'you\'re looking at it...'
      }
    }
  )

module.exports = (process, log) => {
    const argv = process.argv
    //strip ["node","<scriptname>"] from argv
    const args = yargs.parse(argv.slice(2))

    if (!args.spec || args.help) {
        yargs.showHelp(log)
        return process.exit()
    }

    return args
}
