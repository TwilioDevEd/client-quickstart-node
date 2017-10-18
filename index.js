const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const router = require('./src/router');

const config = require('./config');

// Create Express webapp
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));

app.use(router);

// Create http server and run it
const server = http.createServer(app);

server.listen(config.port, function() {
  console.log('Express server running on *:' + config.port);
});
