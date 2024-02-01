if(request.parameters.BotConfig != null){
    
    result = new VirtualAgentConfig();
    result.BotConfig = request.parameters.BotConfig;
    // Assuming request is an object with parameters
const botConfigString = request.parameters.BotConfig.toString();

let botConfigDictionary;
try {
  botConfigDictionary = JSON.parse(botConfigString);
} catch (error) {
  // Handle the error if the JSON parsing fails
  console.error(`Error parsing bot config: ${error.message}`);
}

// Now botConfigDictionary contains the deserialized object
result = new VirtualAgentConfig();
    result.BotConfig = request.parameters.BotConfig;
}

const VirtualAgentConfig = require('./VirtualAgentConfig'); // Assuming there's a VirtualAgentConfig class definition
 

function getConfig(request) {
  let result = null;

  const virtualAgentId = request.parameters.virtualAgentId;
  const busNo = request.executionInfo.busNo;

  try {
    if (request.parameters.BotConfig !== null) {
      const botConfigDictionary = JSON.parse(request.parameters.BotConfig.toString());

      const fieldCount = Object.keys(botConfigDictionary).length;

      if (fieldCount > 0) {
        result = new VirtualAgentConfig();
        result.BotConfig = request.parameters.BotConfig;

        if (botConfigDictionary.hasOwnProperty('integrationVersion')) {
          result.IntegrationVersion = botConfigDictionary.integrationVersion.toString();
        }

        if (virtualAgentId === null) {
          request.parameters.virtualAgentId = 'SessionBot';
          result.VirtualAgentId = 'SessionBot';
        } else {
          result.VirtualAgentId = virtualAgentId.toString();
        }

        if (request.VendorID === '' || request.VendorID === null) {
          _logger.error('No vendor ID supplied with the bot config. Please select a valid vendor');
          return null;
        }

        result.VendorId = request.VendorID;
        return result;
      }
    }

  } catch (error) {
    _logger.error('Failure GetConfig', error);
    return null;
  }

  return result;
}

// Example usage

module.exports = {
  getConfig,
};
function IsValid()
{
    //_TODO: Implemented here
    if ((this == null) || (this.parameters == null) || this.executionInfo == null)
    {
        return false;
    }            
    return true;
}


