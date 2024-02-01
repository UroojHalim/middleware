const UserInputCollectType = require("./UserInputCollectType");
const CollectDtmfRules = require("./CollectDtmfRules");
const PromptBargeConfiguration = require("./PromptBargeConfiguration");
const AudioTranscriptionConfig = require("./AudioTranscriptionConfig");

module.exports = class AudioCollectionRules {
  collectionType = UserInputCollectType.SEND_UTTERANCE_AUDIO;
  dtmfRules = new CollectDtmfRules();
  bargeConfiguration = new PromptBargeConfiguration();
  audioTranscriptionConfig = new AudioTranscriptionConfig();
}