# oas-mocker

A CLI to run a web server that can play in dev env the part of integration partners who publish their API using open-api spec (fka swagger).

The server is a CLI tool (may be installed globally) that is run with a swagger document (which may be in a number of requirable formats: JSON, JS, YAML)

Once started successfully, the server will reply to any path + verb pair (which basically correspond to operation-id) with either a preset reply for this path + verb pair, falling back to a generated reply based on the success response for that operation as described in the open-api-spec of the integration partners.
Thus - once started - you’re ready for integration.

Next - developers can challenge their integration by using a special API to set the server on runtime to return whatever responses they need for whatever operation (WIP)
Preset Reply management API is a post to a configurable path.


## Installation

Just until I'll publish it to npm - clone it from GitHub, and from the cloned folder run
```
npm install -g
```

## Usage
```
oas -s <path to spec file>
```
Full uptions:
```
Options:
  -s, --spec             MANDATORY. name of a requirable module(json, js or
                         yaml) that returns the OAS document or a promise that
                         resolves to OAS document. Relative paths are resolved
                         relative to process.cwd()
  -p, --port             the TCP port to bind the server, overrides whatever is
                         found in the spec                       [default: 3000]
  -n, --hostname         the hostname to run the server, overrides whatever is
                         found in the spec                [default: "localhost"]
  -m, --management-path  the base path for management operations (PUT = set
                         responds, GET = view log)             [default: "/oas"]
  -g, --shutdown-grace   how much ms to wait for graceful shutdown before
                         killing the server abruptly             [default: 1500]
  -l, --logLevel         log level: DEBUG|INFO|WARN|ERROR|FATAL[default: "INFO"]
  -h, --help             you're looking at it...
```

## Architecture Overview
Mind the Legend on the bottom-left corner.
![Architecture Overview](https://docs.google.com/drawings/d/1OLpvIB81FFgSPqnhcRSTu15PK7P79GV9AnzbiNX0F6U/pub?w=1152&h=791 "Architecture Overview")

# Notes
## Future
 - Response setting API - An idiomatic operation that accepts a structure that maps paths + verbs to array of response descriptors
   whenever a request has an explicitly pre-set response - it will be provided instead of a generated one
 
## open issues
 - Do we want to support blueprint / RAML as well? we could do it with a XXX-to-swagger adapter
