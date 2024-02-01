const SilenceRules = require("./SilenceRules");
const AudioCollectionRules = require("./AudioCollectionRules");

module.exports = class PromptBehaviors {
  silenceRules = new SilenceRules();
  audioCollectionRules = new AudioCollectionRules();
}