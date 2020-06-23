<a href="https://www.twilio.com">
  <img src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg" alt="Twilio" width="250" />
</a>

# Twilio Client Quickstart for Node.js
![](https://github.com/TwilioDevEd/client-quickstart-node/workflows/Node.js/badge.svg)

> This template is part of Twilio CodeExchange. If you encounter any issues with this code, please open an issue at [github.com/twilio-labs/code-exchange/issues](https://github.com/twilio-labs/code-exchange/issues).

## About

This application should give you a ready-made starting point for writing your own voice apps with Twilio Client. This application is built in Node.

Implementations in other languages:

| .NET | Java | Python | PHP | Ruby |
| :--- | :--- | :----- | :-- | :--- |
| [Done](https://github.com/TwilioDevEd/client-quickstart-csharp) | [Done](https://github.com/TwilioDevEd/client-quickstart-java)  | [Done](https://github.com/TwilioDevEd/client-quickstart-python)  | [Done](https://github.com/TwilioDevEd/client-quickstart-php) | [Done](https://github.com/TwilioDevEd/client-quickstart-ruby)  |

## Set Up

### Requirements

- [Nodejs](https://nodejs.org/) v10 or v12

### Twilio Account Settings

Before we begin, we need to collect all the config values we need to run the application.

| Config Value  | Description |
| :-------------  |:------------- |
`TWILIO_ACCOUNT_SID` | Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).
`TWILIO_TWIML_APP_SID` | The TwiML application with a voice URL configured to access your server running this app - create one [in the console here](https://www.twilio.com/console/voice/twiml/apps). Also, you will need to configure the Voice "REQUEST URL" on the TwiML app once you've got your server up and running.
`TWILIO_CALLER_ID` | A Twilio phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164) - you can [get one here](https://www.twilio.com/console/phone-numbers/incoming)
`TWILIO_API_KEY` / `TWILIO_API_SECRET` | Your REST API Key information needed to create an [Access Token](https://www.twilio.com/docs/iam/access-tokens) - create [one here](https://www.twilio.com/console/project/api-keys).

### Local development

1. First clone this repository and cd into it:
   ```bash
   git clone https://github.com/TwilioDevEd/client-quickstart-node.git
   cd client-quickstart-node
   ```

2. Create a configuration file for your application and edit the `.env` file.

   ```bash
   cp .env.example .env
   ```

   See [Twilio Account Settings](#twilio-account-settings) to locate the necessary environment variables.

3. Install the dependencies.

   ```bash
   npm install
   ```

4. Launch local development web server.

   ```bash
   npm start
   ```

6. Navigate to [http://localhost:3000](http://localhost:3000)

7. Expose your application to the wider internet using [ngrok](https://ngrok.com/download). You can click [here](https://www.twilio.com/blog/2015/09/6-awesome-reasons-to-use-ngrok-when-testing-webhooks.html) for more details. This step **is important** because the application won't work as expected if you run it through localhost.

   ```bash
   ngrok http 3000
   ```

8. When ngrok starts up, it will assign a unique URL to your tunnel.
   It might be something like `https://asdf456.ngrok.io`. Take note of this.

9. [Configure your TwiML app](https://www.twilio.com/console/voice/twiml/apps)'s
Voice "REQUEST URL" to be your ngrok URL plus `/voice`. For example:

   ![screenshot of twiml app](https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/TwilioClientRequestUrl.original.png)

   You should now be ready to rock! Make some phone calls.
   Open it on another device and call yourself. Note that Twilio Client requires
   WebRTC enabled browsers, so Edge and Internet Explorer will not work for
   testing. We'd recommend Google Chrome or Mozilla Firefox instead.

   > **Note:** You **must** use the https URL, otherwise some browsers will block
   microphone access.

   ![screenshot of chat app](https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/TwilioClientQuickstart.original.png)

That's it!

### Docker

If you have [Docker](https://www.docker.com/) already installed on your machine, you can use our `docker-compose.yml` to setup your project.

1. Make sure you have the project cloned.
2. Setup the `.env` file as outlined in the [Local Development](#local-development) steps.
3. Run `docker-compose up`.
4. Follow the steps in [Local Development](#local-development) on how to expose your port to Twilio using a tool like [ngrok](https://ngrok.com/) and configure the remaining parts of your application.


### Tests

To execute tests, run the following command in the project directory:

```bash
npm test
```

### Cloud deployment

Additionally to trying out this application locally, you can deploy it to a variety of host services. Here is a small selection of them.

Please be aware that some of these might charge you for the usage or might make the source code for this application visible to the public. When in doubt research the respective hosting service first.

| Service                           |                                                                                                                                                                                                                           |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Heroku](https://www.heroku.com/) | [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)                                                                                                                                       |

## Resources

- The CodeExchange repository can be found [here](https://github.com/twilio-labs/code-exchange/).

## Contributing

This template is open source and welcomes contributions. All contributions are subject to our [Code of Conduct](https://github.com/twilio-labs/.github/blob/master/CODE_OF_CONDUCT.md).

## License

[MIT](http://www.opensource.org/licenses/mit-license.html)

## Disclaimer

No warranty expressed or implied. Software is as is.

[twilio]: https://www.twilio.com
