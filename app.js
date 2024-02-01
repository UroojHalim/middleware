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
const {objectIsValidRichContentPrompt,convertStructuredFormatToOriginal,getJObjectRepresentation, processPayload,findCustomPayloadIndex }=require("./mediaObjects");
const detectIntent = require('./botresponse');
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
  let p=String(req.body.customPayload);

  let customPayload_bot = req.body.customPayload;
  let combinedPrompt = '';
  let sessionIdBot= "";
  console.log(userInputType);
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
  // const shouldReturnBotSessionStatePerLifeCycleRules = versionMeetsMinimumDemarcation(virtualAgentConfig.IntegrationVersion, "3.0.0");
}else {
  var sessionId = `BusNo(${busNo})_ContactId(${contactID})`;
  if (contactID < 0) {
    // Generate a random suffix for test sessions
      sessionId += `_random(${Math.floor(Math.random() * 99999999)})`;
    //   }
  //botSessionState.SessionID = sessionId;
 botExchangeResponse.botSessionState.SessionID=  sessionId;
 sessionIdBot=sessionId
 //botExchangeResponse.botSessionState.SessionID =  sessionId;
}}
if (customPayload_bot) {
  // const customPayloadValues = [];
  // for (const key of Object.keys(customPayload_bot)) {
  //   const value = customPayload_bot[key];
  //   customPayloadValues.push(value);
   
  // }
  const  text = req.body.userInput;
  const event=null;
  
  const customPayloadStr = JSON.stringify(customPayload_bot);
  //const customPayloadObject = getJObjectRepresentation(customPayloadStr);
  const result = await detectIntent(sessionIdBot, text,event, customPayloadStr);
   botExchangeResponse.intentInfo.intent = result.intent.displayName;
   botExchangeResponse.intentInfo.intentConfidence = 100;
   combinedPrompt += result.fulfillmentText;;
   const userInputPrompt = new PromptDefinition();
   userInputPrompt.transcript = combinedPrompt.trim()
   prompts.push(userInputPrompt);
   botExchangeResponse.branchName = BotExchangeBranch['PromptAndCollectNextResponse'];
}
//  // prompts[0].transcript = customPayloadValues.join(' '); 
//   //const customPayloadPrompt = new PromptDefinition();
//   //customPayloadPrompt.transcript = customPayloadValues.join(' '); // Combine custom payload values
//   //.push(customPayloadPrompt);
//   combinedPrompt += customPayloadValues.join(' '); 

// }
// // Log or use the extracted values

if (req.body.userInputType == userInputType.AUTOMATED_TEXT && customPayload_bot==null) {
  if (req.body.userInput.toUpperCase() == "WELCOME"){
   const  text = req.body.userInput;
   const result = await detectIntent(sessionIdBot, text); // Assuming sessionIdBot is defined
   botExchangeResponse.intentInfo.intent = result.intent.displayName;
   botExchangeResponse.intentInfo.intentConfidence = 100;
   combinedPrompt += result.fulfillmentText;;
   const userInputPrompt = new PromptDefinition();
   userInputPrompt.transcript = combinedPrompt.trim()
   prompts.push(userInputPrompt);
   botExchangeResponse.branchName = BotExchangeBranch['PromptAndCollectNextResponse'];
  } else{
    const event = req.body.userInput.replace("intent", '').trim();
   const result = await detectIntent(sessionIdBot,  null, event); // Assuming sessionIdBot is defined
   botExchangeResponse.intentInfo.intent = result.intent.displayName;
   botExchangeResponse.intentInfo.intentConfidence = 100;
   combinedPrompt += result.fulfillmentText;;
   const userInputPrompt = new PromptDefinition();
   userInputPrompt.transcript = combinedPrompt.trim()
   prompts.push(userInputPrompt);
   botExchangeResponse.branchName = BotExchangeBranch['PromptAndCollectNextResponse'];
  }
  }
else if (req.body.userInputType == userInputType.TEXT && customPayload_bot == null) {
   const  text = req.body.userInput;
   const result = await detectIntent(sessionIdBot, text); 
  //  sessionIdBot is defined
   botExchangeResponse.intentInfo.Intent = result.intent.displayName;
  botExchangeResponse.intentInfo.intentConfidence = result.intentDetectionConfidence;
  //  botExchangeResponse.intentInfo.LastUserUtterance=
   // prompts[0].transcript = userInput;
   let queryResult = result.fulfillmentMessages;
   console.log(queryResult);
   
   queryResult[0].payload
   if (queryResult && queryResult.length > 0 && queryResult.some(element => element.hasOwnProperty('payload')) ) {
    const index = findCustomPayloadIndex(queryResult);
   let fulfillmentCustPayload = queryResult[index].payload;
    if (objectIsValidRichContentPrompt(fulfillmentCustPayload)) {
      // console.log("fulfillmentCustPayload ", fulfillmentCustPayload );
      // console.log("fulfillmentCustPayload ", typeof fulfillmentCustPayload );
       const originalFormat =convertStructuredFormatToOriginal(fulfillmentCustPayload);
       console.log(originalFormat);
       const prompt = new PromptDefinition();
       // prompt.mediaSpecificObject = fulfillmentCustPayload;
        prompt.mediaSpecificObject = originalFormat ;
        prompts.push(prompt);
      
    }else{
      const originalFormat =convertStructuredFormatToOriginal(fulfillmentCustPayload);
      const result = processPayload(originalFormat);
     if (result) {
    console.log("Intent:", result.intent);
    botExchangeResponse.intentInfo.Intent = result.intent;
    botExchangeResponse.branchName = BotExchangeBranch[result.branchName];
      } 
      botExchangeResponse.customPayload['scriptPayloads'] = originalFormat;
  
     // botExchangeResponse.customPayload['scriptPayloads'] = originalFormat;
    }

} else
{
  queryResult .forEach(message => {
    if (message.text && Array.isArray(message.text.text) && message.text.text.length > 0) {
      // Extract the text message
      const textMessage = message.text.text[0];

      // Create a new prompt for each message
      const prompt = new PromptDefinition();
      prompt.transcript = textMessage;

      // Add the prompt to the prompts array
      prompts.push(prompt);

      // Optionally, update the last user utterance (or any other relevant part of botExchangeResponse)
  
  }
  // Process each message
  // // Example: Create a new prompt for each message
  // const prompt = new PromptDefinition();
  // prompt.transcript = message;
  // //prompts.textToSpeech = message;
  // prompts.push(prompt);
  // botExchangeResponse.intentInfo.LastUserUtterance= message;
  
});}


  //  const fulfillmentMsg = result.fulfillmentMessages;
  //  console.log( result.fulfillmentMsg);
   //console.log( result.fulfillmentMsg.payload);
  
     botExchangeResponse.intentInfo.LastUserUtterance = result.queryText;
     if (result.intent.endInteraction){
      botExchangeResponse.branchName = BotExchangeBranch['ReturnControlToScript'];
     }
  } 
  else if(req.body.userInput.toUpperCase() == "SILENCE")
  {
    const event=req.body.userInput.toUpperCase();
    const result = await detectIntent(sessionIdBot, event); // Assuming sessionIdBot is defined
    combinedPrompt += result.fulfillmentText;;
    console.log( combinedPrompt);
    const userInputPrompt = new PromptDefinition();
    userInputPrompt.transcript = combinedPrompt.trim()
    prompts.push(userInputPrompt);
    botExchangeResponse.intentInfo.Intent = result.intent.displayName;
    botExchangeResponse.intentInfo.intentConfidence = result.intentDetectionConfidence;
    botExchangeResponse.intentInfo.LastUserUtterance = result.queryText;
  }
  else if (req.body.userInputType == userInputType.DTMF_AS_TEXT) {
   const  text = req.body.userInput;
   const result = await detectIntent(sessionIdBot, text); // Assuming sessionIdBot is defined
   botExchangeResponse.intentInfo.intent = result.intent.displayName;
   botExchangeResponse.intentInfo.intentConfidence = result.intentDetectionConfidence;
   combinedPrompt += result.fulfillmentText;;
   const userInputPrompt = new PromptDefinition();
   userInputPrompt.transcript = combinedPrompt.trim()
   prompts.push(userInputPrompt);
     botExchangeResponse.branchName = BotExchangeBranch["DTMF_Breakout_Branch"]

  }
    //     {
    //        ]; botExchangeResponse.Intent = "DTMF";
    //         botExchangeResponse.IntentConfidence = 100;
    //         botExchangeResponse.branchName = BotExchangeBranch["DTMF_Breakout_Branch"
    //         prompts[0].transcript= "I heard you provide digits through DTMF" + req.body.userInput + ".Great numbers!  How else can I help you?";
    //     }
  
  //else if (req.body.userInputType == userInputType.BASE64_ENCODED_G711_ULAW_WAV_FILE) {
//     var base64WavFile = req.body.base64WavFile;
//     if (base64WavFile != "") {
//       prompts[0].base64EncodedG711ulawWithWavHeader = base64WavFile;
//       botExchangeResponse.branchName = BotExchangeBranch['PromptAndCollectNextResponse'];

//     } else {
//       prompts[0].transcript = "NO AUDIO FOUND"
//       botExchangeResponse.branchName = BotExchangeBranch["AudioInputUntranscribeable"];
//     }
//     botExchangeResponse.intentInfo.Intent = "RAW_AUDIO";
//     botExchangeResponse.intentInfo.IntentConfidence = 100;
//   } else if (req.body.userInputType == userInputType.DTMF_AS_TEXT) {
    
//     {
//         botExchangeResponse.Intent = "DTMF";
//         botExchangeResponse.IntentConfidence = 100;
//         botExchangeResponse.branchName = BotExchangeBranch["DTMF_Breakout_Branch"];
//         prompts[0].transcript= "I heard you provide digits through DTMF" + req.body.userInput + ".Great numbers!  How else can I help you?";
//     }
  
     
//   } else if (req.body.userInputType == userInputType.NO_INPUT) {

//     if (req.body.userInput.toUpperCase()== "SILENCE")
//     {

//     botExchangeResponse.branchName = BotExchangeBranch.UserInputTimeout;
//     botExchangeResponse.intentInfo.intent = "UserInputTimeout";
//     botExchangeResponse.intentInfo.intent_confidence = 100;
//     prompts[0].transcript = userInput;
//   }
  // ?};(())
  if(!botExchangeResponse.branchName)
  {botExchangeResponse.branchName = BotExchangeBranch['PromptAndCollectNextResponse']};
 
  botExchangeResponse.nextPromptSequence.prompts = prompts;
  console.log( botExchangeResponse.nextPromptSequence.prompts)
  console.log(botExchangeResponse.nextPromptSequence.prompts)
  console.log('Received request:', req.body);
  console.log('Sending response:', botExchangeResponse);

  return res.json(botExchangeResponse);
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
// else if (shouldReturnBotSessionStatePerLifeCycleRules) {
//   sessionId = `BusNo(${busNo})_ContactId(${contactID})`;
//   if (contactID < 0) {
//     // Generate a random suffix for test sessions
//     sessionId += `_random(${Math.floor(Math.random() * 99999999)})`;
//   }
//   botSessionState = new BotSessionState();
//   botSessionState.SessionID = sessionId;
// } 