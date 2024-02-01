// Assuming JSON module is used
const {VirtualAgentConfig} = require('./VirtualAgentConfig'); // Assuming there's a VirtualAgentConfig class definition


function getConfig(request,botExchangeResponse) {
  let result = null;

  const virtualAgentId = request.virtualAgentId;
  const busNo = request.executionInfo.busNo;

  try {
    if (request.botConfig !== null) {
      const botConfigDictionary = 
    JSON.parse(request.botConfig.toString());

  //     const fieldCount = Object.keys(botConfigDictionary).length;

  //     if (fieldCount > 0) {
  //       result = new VirtualAgentConfig();
  //       result.BotConfig = request.botConfig;

  //       if (botConfigDictionary.hasOwnProperty('integrationVersion')) {
  //         result.IntegrationVersion = botConfigDictionary.integrationVersion.toString();
  //       }

  //       if (virtualAgentId === null) {
  //         request.body.virtualAgentId = 'SessionBot';
  //         result.VirtualAgentId = 'SessionBot';
  //       } else {
  //         result.VirtualAgentId = virtualAgentId.toString();
  //       }

  //       if (request.VendorID === '' || request.VendorID === null) {
  //         botExchangeResponse.errorPromptSequence('No vendor ID supplied with the bot config. Please select a valid vendor');
  //         return null;
  //       }

  //       result.VendorId = request.VendorID;
        return botConfigDictionary;
  //     }
    }

  } catch (error) {
    botExchangeResponse.errorPromptSequence=error;
    return null;
  }

  
}


// function versionMeetsMinimumDemarcation(integrationVersion, minimumVersion) {
//   try {
//     const integration = parseFloat(integrationVersion);
//     const minimum = parseFloat(minimumVersion);

//     return !isNaN(integration) && !isNaN(minimum) && integration >= minimum;
//   } catch (error) {
//     // Handle the error if needed
//     return false;
//   }
// }

// Example usage



// Example usage

module.exports = {
  getConfig,
};

