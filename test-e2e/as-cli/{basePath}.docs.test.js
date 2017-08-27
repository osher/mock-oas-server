const request = require('mocha-ui-exports-request')
const SUT = process.env.SUT || 'http://localhost:3000'
const basePath = "/v2"

module.exports = 
{ '{oas.basePath}.docs':
  { 'GET with no parameters':
    request(
      { url:    SUT + basePath + "/docs"
      , method: 'GET'
      }
    ).responds(
      { status: 200
      , headers:
        { 'content-type' : /text\/html/
        }
      , body: 
        [ /<a id="logo" href="http:\/\/swagger.io">swagger<\/a>/
        , /<form id='api_selector'>/
        , /<body class="swagger-section">/
        ]
      }
    )
  }
}