const PromptSequence = require("./PromptSequence");

module.exports = class SilenceRules {
  engageComfortSequence = false;
  botResponseDelayTolerance = 0;
  comfortPromptSequence = new PromptSequence();
  millisecondsToWaitForUserResponse = 0;
}