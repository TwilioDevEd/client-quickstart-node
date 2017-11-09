const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const router = require('./src/router');

const config = require('./config');

// Create Express webapp
const app = express();

// Add headers
app.all('/*', function(req, res, next) {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-Allow-Origin');
    res.header("Access-Control-Max-Age", "86400"); // 24 hours

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200);
    }
    else {
        next();
    }
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));

app.use(router);

// Create http server and run it
const server = http.createServer(app);

server.listen(config.port, function() {
  console.log('Express server running on *:' + config.port);
});
