class VirtualAgentConfig {
      VirtualAgentId = null;
      BotConfig = null;
      IntegrationVersion = "1.0.0";
      DefaultPromptBehaviors = null;
      TextToSpeechVendor = null;
      TextToSpeechVoiceName = null;
      TranscriptionProfileId = null;
      VoiceIntegration = VoiceIntegrationType.Turn_By_Turn_Control;
      DefaultErrorMessageSequence = null;
    };
  
  
  const VoiceIntegrationType = {
    Turn_By_Turn_Control: 'Turn_By_Turn_Control', // Adjust based on the actual values in C#
    // Add other values if needed
  };
  
  // Assuming PromptBehaviors, PromptSequence, and other dependencies are properly defined
  
  module.exports = {
    VirtualAgentConfig,
    VoiceIntegrationType,
  };
  