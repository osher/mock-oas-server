/**
  holds the logic of the programatic repsonses.
  i.e - accepts directives to responses state machine via 
    descriptors in `set`, and prompts this state machine 
    every time a request is pulled.
 */
module.exports = () => {
    return {
      response,
      set
    }
    
    /**
      @param {string} path - request path
      @param {string} verb - HTTP verb
     */
    function response(path, verb) {
        // TBD: implement! 
        //   1. canned responses state machine
        
        return { type: 'json', status: 200, headers: {}, body: { mock: true} }
    }
    
    /**
      @param {Array(reqDescr)} descriptors
        an array of structures, each describe canned responses per path/verb
      @returns null on success, else - Errors collection
     */
    function set(descriptors) {
        // TBD: implement!
    }
}