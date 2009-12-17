// Create a server to demo/mockup the session management API

var http=require('http')
  , sessions=require('./sessions')
  , port=8080
  , hostname="" // listen on all addresses

http.createServer(requestHandler).listen(port,hostname)

// handle incoming requests
function requestHandler(req,resp){var session,body,options,sessionID

  // lookup or create a new session for this user
  // if the session already exists, we get it from the session ID in the Cookie header, otherwise we create a new session and return that
  // the optional 'options' argument can set things like the life of the session, etc
  options = {lifetime:604800} // make the session persistent, with a lifetime of one week after the last use
  session = sessions.lookupOrCreate(req,options)

  // The returned session object has the following properties:
  // .data, which is an (initially empty) object that you use to store your session data
  // .id, which is the session's ID (read-only)
  // .setCookieHeader(), which gives the value for the setCookieHeader which you have to set on the server response

  // we will use the session to store the visitor's browsing history
  if(!session.data.history) session.data.history = []
  session.data.history.push(req.uri.path)

  // we actually don't care about the URL the user requested, everything gets the same 'hello world' page.
  // but we store the pages the user visits in the session so we can show breadcrumbs on every page
  body = createHelloWorldPage(session.data.history)

  // send the Set-Cookie header value with the response
  resp.sendHeader(200,{'Content-Type':'text/html'
                      ,'Set-Cookie':session.getSetCookieHeaderValue()})
  resp.sendBody(body)
  resp.finish()}

function createHelloWorldPage(history){
  return "<p> Hi there, here is your browsing history: </p>"
       + "<ul>"
       + history.map(function(path){return "<li><a href="+path+">"+path+"</a>\n"})
       + "</ul>"
       + "<p> Here are some other fascinating pages you can visit on our lovely site: </p>"
       + "<ul><li><a href=foo>foo</a><li><a href=bar>bar</a><li><a href=quux>quux</a></ul>"}