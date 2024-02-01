
const BotExchangeBranch = require("./BotExchangeBranch");
const PromptSequence = require("./PromptSequence");
const IntentInfo = require("./IntentInfo");
const PromptBehaviors = require("./PromptBehaviors");
const BotErrorDetails = require("./BotErrorDetails");
const  BotSessionState= require("./BotSessionState");

var debug = require('debug')('javascriptechoproxy:server');

module.exports = class CustomExchangeResponse_V1 {
  branchName = null;
  nextPromptSequence = new PromptSequence();
  intentInfo = new IntentInfo();
  nextPromptBehaviours = new PromptBehaviors();
  errorDetails = new BotErrorDetails();
  customPayload = {};
  botSessionState = new BotSessionState();
}