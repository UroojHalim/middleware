// detectIntent.js
const path = require('path');
const { SessionsClient } = require('@google-cloud/dialogflow');
const{ formatCustomPayload }= require("./mediaObjects");
const projectId = 'order-bot-mlaa'; // Replace with your Dialogflow project ID
const serviceAccountKeyPath = path.join(__dirname, 'order-bot-mlaa-b23dbdb438dc.json');

const sessionClient = new SessionsClient({
  keyFilename: serviceAccountKeyPath, // Replace with the path to your service account key file
});

async function detectIntent(sessionId, text, event, custompayload) {

const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
console.log(event);
let request=[];
  // const request = {
  //   session: sessionPath,
  //   queryInput: {
  //     text: {
  //       text: text || '',
  //       languageCode: 'en-US', // Adjust language code if needed
  //     },
  //     event: {
  //       name:event || '' ,
  //       languageCode: 'en-US', // or any other language
  //   },
  //     intent: event || text,
  //   },
  // };
  if  (event !== null && event !== undefined) {
    request = {
        session: sessionPath,
        queryInput: {
          event: {
                  name:event || '' ,
                  languageCode: 'en-US', // or any other language
              },
              intent: event,
                },
  } } else if(custompayload){
   // const customPayload = formatCustomPayload(custompayload);
   const customPayload ={ 
    "echoValue": "Passing Json to Bot method1"
   }
    console.log('custompayload', custompayload);
    request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text || '',
          languageCode: 'en-US', // Adjust language code if needed
        },
            intent: text,
              },
              QueryParams: {
                Payload: {}
            }
            }

//let json = JSON.parse(custompayload);
const customPayloadStr = JSON.stringify(customPayload);
let json = JSON.parse(customPayloadStr);
let payload = {};
for (let key in json) {

    payload[key] = json[key].toString();
}
console.log(payload)
request.QueryParams.Payload = {};

  }

  else {
     request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: text || '',
            languageCode: 'en-US', // Adjust language code if needed
          },
        
          intent: event,
                },
  }
}

  try {
    console.log("request", request);
    const responses = await sessionClient.detectIntent(request);
    //console.log(responses);
    const result = responses[0].queryResult;
    console.log(result)
    return result;
  } catch (error) {
    console.error('Error in detectIntent:', error);
    throw error; // Rethrow the error for the caller to handle
  }
}

module.exports = detectIntent;
