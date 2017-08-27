module.exports = require('mocha-e2e').exports(
  { svc:  "bin/cli"
  , args: ["-s","test/fixtures/petstore.oas.yaml","-l","debug"]
  , readyNotice: "server started"
//  , term_ipc: "IPCTERM"
  , term_code: "SIGINT"
  , term_timeout: 30000
  , suites: 
    [ "test-e2e/as-cli/{basePath}.docs.test.js"
    ]
  }
)