var http = require('http');
var path = require('path');
var ClientCapability = require('twilio').jwt.ClientCapability;
var VoiceResponse = require('twilio').twiml.VoiceResponse;
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
  var capability = new ClientCapability({
    accountSid: config.TWILIO_ACCOUNT_SID,
    authToken: config.TWILIO_AUTH_TOKEN
  });

  capability.addScope(new ClientCapability.IncomingClientScope(identity));
  capability.addScope(new ClientCapability.OutgoingClientScope({
    applicationSid: config.TWILIO_TWIML_APP_SID,
    clientName: identity
  }));

  // Include identity and token in a JSON response
  response.send({
    identity: identity,
    token: capability.toJwt()
  });
});

app.post('/voice', function (req, res) {
  // Create TwiML response
  var twiml = new VoiceResponse();

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
