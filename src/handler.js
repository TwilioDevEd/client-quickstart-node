const VoiceResponse = require('twilio').twiml.VoiceResponse;
const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const nameGenerator = require('../name_generator');
const config = require('../config');

var identity = nameGenerator();

exports.tokenGenerator = function tokenGenerator() {
  
  const accessToken = new AccessToken(config.accountSid,
      config.apiKey, config.apiSecret);
  accessToken.identity = identity;
  const grant = new VoiceGrant({
    outgoingApplicationSid: config.twimlAppSid,
    incomingAllow: true,
  });
  accessToken.addGrant(grant);

  // Include identity and token in a JSON response
  return {
    identity: identity,
    token: accessToken.toJwt(),
  };
};

exports.voiceResponse = function voiceResponse(requestBody) {
  
  const toNumberOrClientName = requestBody.To;
  
  // Create a TwiML voice response
  let twiml = new VoiceResponse();
    
  if (requestBody.To == config.callerId) {
    dial = twiml.dial();
    dial.client(identity);
  } else if (requestBody.To) {
    dial = twiml.dial({callerId: config.callerId});
  

    console.log('inside incoming number if block')
    // Check if the 'To' parameter is a phone number or the name of a client
    const attr = isAValidPhoneNumber(toNumberOrClientName) ? 'number' : 'client';
    dial[attr]({}, toNumberOrClientName);
  } else {
    twiml.say("Thanks for calling!");
  }

  return twiml.toString();
};

/**
* Checks if the given value is valid as phone number
* @param {Number|String} number
* @return {Boolean}
*/
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
