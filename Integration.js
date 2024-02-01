const express = require('express');
const bodyParser = require('body-parser');
const { SessionsClient } = require('@google-cloud/dialogflow');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const projectId = 'order-bot-mlaa'; // Replace with your Dialogflow project ID

const serviceAccountKeyPath = path.join(__dirname, 'order-bot-mlaa-b23dbdb438dc.json');

const sessionClient = new SessionsClient({
  keyFilename: serviceAccountKeyPath, // Replace with the path to your service account key file
});

app.use(bodyParser.json());

app.post('/proxy', async (req, res) => {
  try {
    const { text, userId,intent } = req.body;

    const sessionPath = sessionClient.projectAgentSessionPath(projectId, userId);
   // const sessionPath =sessionClient.detectIntent(projectId, userId);
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: 'en-US', // Adjust language code if needed
        },
        intent: intent || '',
      },
    };
    console.log(request)
    const responses = await sessionClient.detectIntent(request);
  console.log(responses)


    const result = responses[0].queryResult;
    //const result2= responses[1].intent;

    console.log(result);
    //res.json(responses);
    res.json({ response: result.fulfillmentText, intent:result.intent.displayName,parameters: result.parameters, custompayload: result.fulfillmentMessages});
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});