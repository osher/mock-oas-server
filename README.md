# oas-mocker

## Overview

The server can play in dev env the part of integration partners who publish their API using open-api spec (fka swagger).

The server is a CLI tool (may be installed globally) that is run with a swagger document (which may be in a number of requirable formats: JSON, JS, YAML)

> Do we want to support blueprint / RAML as well?
>      we could do it with a XXX-to-swagger adapter

Once started, the server will reply to any path + verb pair (which basically correspond to operation-id) with a prepared reply based on the success response for that operation as stated in swagger of the integration partners.
So - once started - you’re ready for integration.

Next - developers can challenge their integration by using a special API to set the server on runtime to return whatever responses they need for whatever operation.

Reply management API is a post to a configurable path.




## Response setting API: 
An idiomatic operation that accepts a structure that maps paths + verbs to array of response descriptors.






