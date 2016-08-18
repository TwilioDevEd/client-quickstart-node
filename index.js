var http = require('http');
var path = require('path');
var twilio = require('twilio');
var express = require('express');
var bodyParser = require('body-parser');
var randomUsername = require('./randos');
var config = require('./config');

// Create Express webapp
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

/*
Generate a Capability Token for a Twilio Client user - it generates a random
username for the client requesting a token.
*/
app.get('/token', function(request, response) {
  var identity = randomUsername();
  
  var capability = new twilio.Capability(config.TWILIO_ACCOUNT_SID,
    config.TWILIO_AUTH_TOKEN);
  capability.allowClientOutgoing(config.TWILIO_TWIML_APP_SID);
  capability.allowClientIncoming(identity);
  var token = capability.generate();

  // Include identity and token in a JSON response
  response.send({
    identity: identity,
    token: token
  });
});

app.post('/voice', function (req, res) {
  // Create TwiML response
  var twiml = new twilio.TwimlResponse();
  
  if(req.body.To) {
    twiml.dial({ callerId: config.TWILIO_CALLER_ID}, function() {
      // wrap the phone number or client name in the appropriate TwiML verb
      // by checking if the number given has only digits and format symbols
      if (/^[\d\+\-\(\) ]+$/.test(req.body.To)) {
        this.number(req.body.To);
      } else {
        this.client(req.body.To);
      }
    });
  } else {
    twiml.say("Thanks for calling!");
  }

  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});

// Create http server and run it
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('Express server running on *:' + port);
});
