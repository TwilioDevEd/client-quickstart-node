const Router = require('express').Router;
const {tokenGenerator, voiceResponse} = require('./handler');

const router = new Router();

const twilioNumber = process.env.TWILIO_CALLER_ID;

/**
 * Generate a Capability Token for a Twilio Client user - it generates a random
 * username for the client requesting a token.
 */
router.get('/token', (req, res) => {
  res.send(tokenGenerator());
});

router.post('/voice', (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(voiceResponse(req.body));
});


module.exports = router;
