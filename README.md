<a href="https://www.twilio.com">
  <img src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg" alt="Twilio" width="250" />
</a>

# Twilio Client Quickstart for Node.js
[![Build Status](https://travis-ci.org/TwilioDevEd/client-quickstart-node.svg?branch=master)](https://travis-ci.org/TwilioDevEd/client-quickstart-node)

> We are currently in the process of updating this sample template. If you are encountering any issues with the sample, please open an issue at [github.com/twilio-labs/code-exchange/issues](https://github.com/twilio-labs/code-exchange/issues) and we'll try to help you.

This application should give you a ready-made starting point for writing your
own voice apps with Twilio Client. Before we begin, we need to collect
all the config values we need to run the application:

| Config&nbsp;Value  | Description |
| :-------------  |:------------- |
Account&nbsp;SID | Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).
Auth&nbsp;Token | Used to authenticate - [just like the above, you'll find this here](https://www.twilio.com/console).
TwiML&nbsp;App&nbsp;SID | The TwiML application with a voice URL configured to access your server running this app - create one [in the console here](https://www.twilio.com//console/phone-numbers/dev-tools/twiml-apps). Also, you will need to configure the Voice "REQUEST URL" on the TwiML app once you've got your server up and running.
Twilio&nbsp;Phone&nbsp;# | A Twilio phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164) - you can [get one here](https://www.twilio.com/console/phone-numbers/incoming)

## Setting Up The Node.js Application

1. Create a configuration file for your application:

   ```bash
   cp .env.example .env
   ```

1. Edit `.env` with the four configuration parameters we gathered from above.

1. Next, we need to install our dependencies from npm:

   ```bash
   npm install
   ```

1. Now we should be all set! Run the application using `npm`.

   ```bash
   npm start
   ```

   Your application should now be running at http://localhost:3000.
   Leave the server running and continue on in another command window.

1. [Download and install ngrok](https://ngrok.com/download)

1. Run ngrok:

   ```bash
   ngrok http 3000
   ```

1. When ngrok starts up, it will assign a unique URL to your tunnel.
   It might be something like `https://asdf456.ngrok.io`. Take note of this.

> [Learn 6 awesome reasons why to use ngrok](https://www.twilio.com/blog/2015/09/6-awesome-reasons-to-use-ngrok-when-testing-webhooks.html).

1. [Configure your TwiML app](https://www.twilio.com/console/voice/twiml/apps)'s
Voice "REQUEST URL" to be your ngrok URL plus `/voice`. For example:

   ![screenshot of twiml app](https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/TwilioClientRequestUrl.original.png)

   You should now be ready to rock! Make some phone calls.
   Open it on another device and call yourself. Note that Twilio Client requires
   WebRTC enabled browsers, so Edge and Internet Explorer will not work for
   testing. We'd recommend Google Chrome or Mozilla Firefox instead.

> **Note:** You **must** use the https URL, otherwise some browsers will block
   microphone access.

   ![screenshot of chat app](https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/TwilioClientQuickstart.original.png)

### Run tests

```bash
npm test
```

## Meta

* No warranty expressed or implied. Software is as is. Diggity.
* [MIT License](http://www.opensource.org/licenses/mit-license.html)
* Lovingly crafted by Twilio Developer Education.
