# oas-mocker

## Overview

The server can play in dev env the part of integration partners who publish their API using open-api spec (fka swagger).

The server may be run in two ways:
 - run as a CLI tool (may be installed globally) that is run with a swagger document (which may be in a number of requirable formats: JSON, JS, YAML)
 - run as a module, in process with the test harness

The later is easier to run asserts against reqeusts the mock server did and the responses it provided, where the earlier is eaier to setup once and act a role of a service simulating integrated environment.

## Features

### Out of the box run

Once started, the server will reply to any path + verb pair (which basically correspond to operation-id) with a prepared reply based on the success response for that operation as stated in swagger of the integration partners.
So - once started - you’re ready for integration.

Feature Status: *Done*

### Canned Responses

On the next level - developers can challenge their integration by configuring the started server to reply in a specific way which may or may not be according to the spec - basically whatever responses they need to challenge their code.

This is done using a special API to charge the server with canned-responses.

The server can hold a cans-store, which is a map of a magazine of cans per operation-id.
Each can can be used a given amount of times before it is consumed and depleted.
Each can be guarded with a filter which makes it applicable only for requests that pass the filter.
A canned response will be served whenever a the operation-id that matches the request has a magazine, and that magazine has a can who's guard filter accepts the request.

The API to set the cans is an idempotent operation: It accepts a structure that maps paths + verbs to array of response descriptors, and uses that map, discarding any cans-store it had before.


Feature Status: *In Development*

### Dynamic / Evaluated response

A canned response may include special expressions whose values are evaluated against the request.
This is particularly useful for example when you want a get-by-id entity to interpolate the exact id it was asked for without much fuss.

Feature Status: *TBD*


## Open issues:

> Do we want to support blueprint / RAML as well?
>      we may do it with a XXX-to-swagger adapter








