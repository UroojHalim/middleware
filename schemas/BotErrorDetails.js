const BotLoopErrorBehavior = require("./BotLoopErrorBehavior");
const PromptSequence = require("./PromptSequence");

module.exports = class BotErrorDetails {
  errorBehaviour =  BotLoopErrorBehavior.ReturnControlToScriptThroughErrorBranch;
  errorPromptSequence = new PromptSequence();
  systemErrorMessage;
}