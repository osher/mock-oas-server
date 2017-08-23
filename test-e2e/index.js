      
module.exports = 
{ 'run as CLI with only with a yaml' : 'skip' || e2eTest(
    { args: { s: 'test/fixtures/petstore.oas.yaml' } }
  )
, 'run in-process with only a yaml as options'
}

const run = require('child_process').fork
function e2eTest({args}) {
    args = Object.keys(args).reduce( (arr, k) => arr.push( k.length > 1 ? "--" + k : k, args[k] ) && arr, [] )
    let child
    
    return {
      before: (done) => {
          child = (process.execPath, ctx.args, { 
            env:   extend( extend({}, process.env), ctx.env || {}),
            cwd:   ctx.cwd,
            stdio: ["pipe","pipe", "pipe", "ipc"]
          })
      },
      after: (done) => {
      }
    }
}
