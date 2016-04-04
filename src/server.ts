/// <reference path="../typings/tsd.d.ts" />
import app = require('./app');
import http = require('http');
var pkgJson = require('../package.json');


// -- determine listening port and save it
var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// -- create the http server
var server = http.createServer(app);

// -- start listening on port
server.listen(port);

// -- hook server event handlers
server.on('error', onError);
server.on('listening', onListening);

// -- normalizes the port
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// -- error handler
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// -- listened handler
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;

  console.log("Server started on %s in %s mode %s", bind, app.get('env'), pkgJson.version);
}
