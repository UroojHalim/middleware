const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Replace 'YOUR_DIALOGFLOW_ES_PROJECT_ID' and 'YOUR_SERVICE_ACCOUNT_JSON_FILE' with your Dialogflow ES project ID and Service Account JSON file.
const dialogflowProjectId = 'YOUR_DIALOGFLOW_ES_PROJECT_ID';
const serviceAccountJsonFile = 'path/to/your/service-account-json-file.json';

app.use(express.json());

// Proxy endpoint to forward requests to Dialogflow ES API
app.post('/proxy', async (req, res) => {
  try {
    const dialogflowResponse = await sendToDialogflow(req.body);
    res.json(dialogflowResponse);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to send requests to Dialogflow ES API
async function sendToDialogflow(request) {
  const dialogflowEndpoint = `https://dialogflow.googleapis.com/v2/projects/${dialogflowProjectId}/agent/sessions/test-session-id:detectIntent`;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${await getAccessToken()}`,
  };

  const response = await axios.post(dialogflowEndpoint, request, { headers });

  return response.data;
}

// Function to get access token from Service Account JSON file
async function getAccessToken() {
  const { client_email, private_key } = require(serviceAccountJsonFile);
  const scope = 'https://www.googleapis.com/auth/cloud-platform';

  const { data } = await axios.post(
    `https://www.googleapis.com/oauth2/v4/token`,
    `grant_type=client_credentials&client_id=${encodeURIComponent(client_email)}&client_secret=${encodeURIComponent(private_key)}&scope=${encodeURIComponent(scope)}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data.access_token;
}

// Start the server
app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
