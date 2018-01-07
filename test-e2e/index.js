module.exports = require('e2e-helper').exports(
  { svc:  "bin/cli"
  , args: ["-s","test/fixtures/petstore.oas.yaml","-l","debug"]
  , readyNotice: "server started"
  , term_ipc: "IPCTERM"
  , term_code: "SIGTERM"
  , term_timeout: 10000
  , suites: 
    [ "test-e2e/as-cli/{basePath}.docs.test.js"
    ]
  }
)