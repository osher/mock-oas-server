const assign      = Object.assign
const sway        = require('sway')
const swagger     = require('swagger-tools')
const express     = require('express')
const bodyParser  = require('body-parser')

const canFctry    = require('../model/can-mgr')
const genFctry    = require('../model/gen-mgr')

const cannedRes   = require('./canned-responses')
const mapRequest  = require('./request-mapper')

module.exports    = serverPromise

function serverPromise(ctx) {
    const err = validate(ctx)
    return err
      ? Promise.reject(err)
      : sway.create({definition: ctx.args.spec})
        .then( sway => initMw  (assign(ctx, {sway})) )
        .then( mw   => buildApp(assign(ctx, {mw  })) )
}

function validate(ctx) {
    // TBD: validate context
    //  - must contain args.spec, 
    //  - must contain args.managementPath
    //I currently don't do it, - I trust that ctx.args is provided as lib/args
}

function initMw(ctx) {
    const {sway, args: { hostname, port }} = ctx
    sway.host = 
      sway.definition.host = 
        sway.definitionFullyResolved = hostname + ':' + port

    return new Promise( (acc,rej) => {
        swagger.initializeMiddleware(
          ctx.sway.definition, 
          (mw) => mw instanceof Error ? rej(mw) : acc(mw)
        )
    })
}

function buildApp(ctx) {
    const { mw, sway, args: { managementPath } } = ctx
    const app = ctx.app = express()
    app.disable('x-powered-by')
    app.set('etag', false);
    
    //response providers
    const canMgr = ctx.canMgr = canFctry({ /* TBD: inject initial canned responses */ })
    const genMgr = ctx.genMgr = genFctry({sway})
    
    //canned res web controller
    const canned    = ctx.canned    = cannedRes({canMgr, genMgr})
    
    //swagger ops
    app.use( sway.definition.basePath || '/', 
      [ mw.swaggerMetadata()
      //TODO: , mw.swaggerSecurity(...)
      , mw.swaggerValidator()
      , canned.response
      ]
    )

    //manage, test & assert ops
    app.use( managementPath, mw.swaggerUi() )
    app.put( managementPath, 
      [ bodyParser.json()
      , canned.set
      ]
    )
    app.get( managementPath, canned.flushLog )
    
    app.use( reqErrHandler )
    
    return app

    function reqErrHandler(e,q,r,n) {
        const errorView = Object.assign({message: e.message, stack: e.stack.replace(/\\/g,"/").split("\n")}, e)
        
        app.emit('error', Object.assign(e, { request: mapRequest(q) }))
        
        r.status(500).end(
          JSON.stringify(
            { message: 'oas hard error'
            , descr:   'ouch. I got some error filling your request'
            , error:   errorView
            }
          , null
          , 2
          )
        )
    }
}
