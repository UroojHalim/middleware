const express = require('express');
const CustomExchangeResponse_V1 = require("./schemas/CustomExchangeResponse_V1");
const PromptDefinition = require("./schemas/PromptDefinition");
const BotExchangeBranch= require("./schemas/BotExchangeBranch");
const BotSessionState=require("./schemas/BotSessionState");
const userInputType = require("./schemas/UserInputType");
const { getConfig,versionMeetsMinimumDemarcation } = require('./Get');
const {VirtualAgentConfig}= require( "./VirtualAgentConfig" )
const bodyParser = require('body-parser');
const { SessionsClient } = require('@google-cloud/dialogflow');
const app = express();
const path = require('path');
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/', async (req, res) => {
  var botExchangeResponse = new CustomExchangeResponse_V1();
  botExchangeResponse.nextPromptBehaviours = null;

  let userInput = req.body.userInput;
  let prompts = [];
  const busNo = req.body.executionInfo.busNo;
  const contactID = req.body.executionInfo.contactId;
  let virtualAgentConfig = new VirtualAgentConfig();
  let botSessionState = new BotSessionState(); 
  let sessionState=req.body.botSessionState;
  let customPayload_bot = req.body.customPayload;
  let combinedPrompt = '';
  let sessionIdBot= "";
 if(req.body.botConfig != null)
{
   virtualAgentConfig = getConfig(req.body,botExchangeResponse);
}
if (sessionState && Object.keys(sessionState).length > 0){
try {
  console.log(sessionState)
    botSessionState = sessionState;
    if (botSessionState && botSessionState.SessionID && botSessionState.SessionID !== '') {
      sessionIdBot = botSessionState.SessionID;
      botExchangeResponse.botSessionState.SessionID=sessionIdBot;
    } 
  } catch (error) {
    console.error(`Error deserializing BotSessionState: ${error.message}`);
  }
}else {
  var sessionId = `BusNo(${busNo})_ContactId(${contactID})`;
  if (contactID < 0) {
    // Generate a random suffix for test sessions
      sessionId += `_random(${Math.floor(Math.random() * 99999999)})`;
   
 botExchangeResponse.botSessionState.SessionID=  sessionId;
 sessionIdBot=sessionId
}}

const projectId = 'order-bot-mlaa'; // Replace with your Dialogflow project ID

const serviceAccountKeyPath = path.join(__dirname, 'order-bot-mlaa-b23dbdb438dc.json');

const sessionClient = new SessionsClient({
  keyFilename: serviceAccountKeyPath, // Replace with the path to your service account key file
});

if (req.body.userInputType == userInputType.AUTOMATED_TEXT) 
{
   if (req.body.userInput.toUpperCase() == "WELCOME"){
     try {
   const  text = req.body.userInput;
   const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: 'en-US', // Adjust language code if needed
        },
        intent: text || '',
      },
    };
    console.log(request)
    const responses = await sessionClient.detectIntent(request);
    console.log(responses)
   const result = responses[0].queryResult;
    botExchangeResponse.intentInfo.intent = result.intent.displayName;
    botExchangeResponse.intentInfo.intentConfidence = 100;
     
    combinedPrompt += result.fulfillmentText;
    const userInputPrompt = new PromptDefinition();
    userInputPrompt.transcript = userInput;
    userInputPrompt.transcript = combinedPrompt.trim()
    prompts.push(userInputPrompt);
    prompts[0].textToSpeech = userInput;
    botExchangeResponse.branchName = BotExchangeBranch['PromptAndCollectNextResponse'];
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
   };
  }
  

 };



  botExchangeResponse.nextPromptSequence.prompts = prompts;
  console.log( botExchangeResponse.nextPromptSequence.prompts)
  console.log(botExchangeResponse.nextPromptSequence.prompts)
  console.log('Received request:', req.body);
  console.log('Sending response:', botExchangeResponse);

  return res.json(botExchangeResponse);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
