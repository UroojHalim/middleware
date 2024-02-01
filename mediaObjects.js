// if (fulFillmentMessage.Payload != null)
// {

//     Dictionary<string, object> fulfillmentCustPayload = JsonConvert.DeserializeObject<Dictionary<string, object>>(fulFillmentMessage.Payload.ToString());

//     #endregion
//     {
//         // Latest integrationVersion Logic - Put RichContent in prompts and scriptPayloads in scriptPayload
//         // It is important went coding around IntegrationVersion, to make OLDER version the EXCEPTION, and leave the latest version
//         // as open ended.  Never write explicit version matching for the LATEST version.

//         if (RichContentUtils.ObjectIsValidRichContentPrompt(fulfillmentCustPayload))
//         {
//             newPrompt.mediaSpecificObject = fulfillmentCustPayload;
//         }
//         else
//         {
//             // Put the object in scriptPayloads in customPayload out
//             BotResponseUtilities.AddScriptPayloadToBotResponse(actionResponse, fulfillmentCustPayload);
//         }
//     }

//     const isValidRichContentPrompt = (objectPayload) => {
//         let result = false;
      
//         if (objectPayload !== null && objectPayload !== undefined) {
//           try {
//             const objectAsJson = JSON.stringify(objectPayload);
//             result = jsonIsValidRichContentPrompt(objectAsJson); // Assuming this function is defined elsewhere
//           } catch (error) {
//             // Error handling if needed, or leave empty to ignore the error
//           }
//         }
      
//         return result;
//       };
      
//       // Example usage
//       const examplePayload = { /* your object here */ };
//       console.log(isValidRichContentPrompt(examplePayload));
    
//         if (fulFillmentMessage && fulFillmentMessage.Payload) {
//             let fulfillmentCustPayload = JSON.parse(fulFillmentMessage.Payload);
//             if (objectIsValidRichContentPrompt(fulfillmentCustPayload)) {
//                 let newPrompt = {};
//                 newPrompt.mediaSpecificObject = fulfillmentCustPayload;
//                 // Further processing with newPrompt
//                 // ...
//             }
//         }
function objectIsValidRichContentPrompt(objectPayload) {
        if (objectPayload) {
            try {
                let objectAsJson = JSON.stringify(objectPayload);
                return jsonIsValidDfoMessage(objectAsJson);
            } catch {
                // Error handling if needed
            }
        }
        return false;
    }
    
    // function jsonIsValidDfoMessage(json) {
    //     try {
    //         let jsonDictionary = JSON.parse(json);
    //         if (jsonDictionary.hasOwnProperty('dfoMessage')) {
    //             let attempt = JSON.parse(JSON.stringify(jsonDictionary['dfoMessage']));
    //             return attempt != null && attempt.MessageContent != null;
    //         }
    //     } catch {
    //         // Error handling if needed
    //     }
    //     return false;
    // };
    

    // function jsonIsValidDfoMessage(jsonDictionary) {
    //     console.log(jsonDictionary);
    //     if (jsonDictionary.fields && jsonDictionary.fields.dfoMessage) {
    //         let dfoMessageObj = jsonDictionary.fields.dfoMessage;
    //         // Assuming dfoMessageObj is structured correctly and has a MessageContent property
    //        // return dfoMessageObj.structValue && dfoMessageObj.structValue.MessageContent != null;
    //        return true;
        
    //     }
    //     return false;
    // }
    // function jsonIsValidDfoMessage(jsonDictionary) {
    //     console.log(jsonDictionary);
    //     console.log("jsonDictionary:", jsonDictionary);
    // console.log("Type of jsonDictionary:", typeof jsonDictionary);
    //     if ('fields' in jsonDictionary) {
    //         console.log("'fields' exists in jsonDictionary");
    //     } else {
    //         console.log("'fields' does not exist in jsonDictionary");
    //     }
    
    //     // Check if 'dfoMessage' property exists inside 'fields'
    //     if ('dfoMessage' in jsonDictionary.fields) {
    //         console.log("'dfoMessage' exists in fields");
    //     } else {
    //         console.log("'dfoMessage' does not exist in fields");
    //     }
    //     if (jsonDictionary.fields && jsonDictionary.fields.dfoMessage) {
    //         let dfoMessageObj = jsonDictionary.fields.dfoMessage;
    
    //         if (dfoMessageObj.structValue && dfoMessageObj.structValue.fields) {
    //             let messageContentObj = dfoMessageObj.structValue.fields.messageContent;
    
    //             if (messageContentObj && messageContentObj.structValue && messageContentObj.structValue.fields) {
    //                 // Now we are at the level of 'type' and 'payload'
    //                 let payloadObj = messageContentObj.structValue.fields.payload;
    //                 if (payloadObj && payloadObj.structValue && payloadObj.structValue.fields) {
    //                     // Check if 'text' exists and has a value
    //                     let textObj = payloadObj.structValue.fields.text;
    //                     return textObj && textObj.stringValue != null;
    //                 }
    //             }
    //         }
    //     }
    //     return false;
    // }
    
    function jsonIsValidDfoMessage(jsonString) {
        try {
            let jsonDictionary = JSON.parse(jsonString);
            console.log("Parsed jsonDictionary:", jsonDictionary);
    
            if (jsonDictionary.fields && jsonDictionary.fields.dfoMessage) {
                let dfoMessageObj = jsonDictionary.fields.dfoMessage;
                console.log("dfoMessageObj:", dfoMessageObj);
    
                // Now you can continue with your logic to check the structure
                // ...
    
                return true; // or false based on your validation logic
            }
        } catch (error) {
            console.log("Error parsing JSON:", error);
        }
        return false;
    }

    // function convertStructuredFormatToOriginal(jsonStructured) {
    //     console.log(jsonStructured);
    //     console.log("Type of jsonDictionary:", typeof jsonStructured );

    //     if (!jsonStructured || typeof jsonStructured !== 'object') return {};
    
    //     const convertValue = (value) => {
    //         switch (value.kind) {
    //             case 'stringValue':
    //                 return value.stringValue;
    //             case 'structValue':
    //                 return convertStructuredFormatToOriginal(value.structValue.fields);
    //             default:
    //                 return null;
    //         }
    //     };
    
    //     let originalFormat = {};
    //     for (const key in jsonStructured.fields) {
    //         originalFormat[key] = convertValue(jsonStructured.fields[key]);
    //     }
    
    //     return originalFormat;
    // }

// function convertStructuredFormatToOriginal(structuredObj) {
//     if (!structuredObj || typeof structuredObj !== 'object') return {};

//     // Helper function to handle different kinds of values
//     function handleValue(value) {
//         if (value.kind === 'stringValue') {
//             return value.stringValue;
//         } else if (value.kind === 'structValue' && value.structValue && value.structValue.fields) {
//             return convertStructuredFormatToOriginal(value.structValue.fields);
//         } else {
//             return {};
//         }
//     }

//     // Convert each field in the object
//     const originalFormat = {};
//     for (const key in structuredObj) {
//         const item = structuredObj[key];
//         originalFormat[key] = handleValue(item);
//         console.log(originalFormat)
//     }
    
//     return originalFormat;
// }
// function convertStructuredFormatToOriginal(structuredObj) {
//     if (!structuredObj || typeof structuredObj !== 'object') return {};

//     function handleValue(value) {
//         if (value.kind === 'stringValue') {
//             return value.stringValue;
//         } else if (value.kind === 'structValue') {
//             if (value.structValue && value.structValue.fields) {
//                 return convertStructuredFormatToOriginal(value.structValue.fields);
//             } else {
//                 return null; // or an appropriate default value
//             }
//         } else if (value.kind === 'listValue') {
//             if (value.listValue && value.listValue.values) {
//                 return value.listValue.values.map(v => handleValue(v));
//             } else {
//                 return []; // or an appropriate default value
//             }
//         } else {
//             // Handle other types or provide a default value
//             return null; // or an appropriate default value
//         }
//     }

//     const originalFormat = {};
//     for (const key in structuredObj) {
//         const item = structuredObj[key];
//         originalFormat[key] = handleValue(item);
//     }

//     return originalFormat;
// }

// function convertStructuredFormatToOriginal(structuredObj) {
//     if (!structuredObj || typeof structuredObj !== 'object') return {};

//     function handleValue(value) {
//         if (value.kind === 'stringValue') {
//             return value.stringValue;
//         } else if (value.kind === 'structValue') {
//             if (value.structValue && value.structValue.fields) {
//                 return convertStructuredFormatToOriginal(value.structValue.fields);
//             }
//         }
//         // Add more cases here if there are other kinds like 'listValue', etc.
//         return null; // Return null for unhandled types or unknown formats
//     }

//     const originalFormat = {};
//     for (const key in structuredObj) {
//         if (structuredObj.hasOwnProperty(key)) {
//             const item = structuredObj[key];
//             originalFormat[key] = handleValue(item);
//         }
//     }

//     return originalFormat;
// }
function convertStructuredFormatToOriginal(jsonString) {
    // Parse the JSON string first
    
    function handleValue(value) {
        // Handle stringValue directly
        if (value.kind === 'stringValue') {
            return value.stringValue;
        } 
        // If it's a structValue with fields, process each field recursively
        else if (value.kind === 'structValue') {
            if (value.structValue && value.structValue.fields) {
                return convertFields(value.structValue.fields);
            }
        }
        else if (value.kind === 'listValue') {
            if (value.structValue && value.structValue.fields) {
                return convertFields(value.structValue.fields);
            }
             // Process each item in the list
             if (value.listValue && value.listValue.values) {
                return value.listValue.values.map(handleValue);
            }
        }
        return null; // Return null for unhandled types or unknown formats
    }

    function convertFields(fields) {
        const originalFormat = {};
        for (const key in fields) {
            if (fields.hasOwnProperty(key)) {
                const item = fields[key];
                originalFormat[key] = handleValue(item);
            }
        }
        return originalFormat;
    }

    // Assuming the top-level structure is always 'fields'
    return convertFields(jsonString.fields);
}

function processPayload(payload) {
    if (payload.contentType === "ExchangeResultOverride") {
        const content = payload.content;
        if (content) {
            const intent = content.intent;
            const branchName = content.vahExchangeResultBranch;
            return { intent, branchName };
        }
    }
    return null; // or some default value
}
function findCustomPayloadIndex(queryResult) {
    if (queryResult && queryResult.length > 0) {
        // Find the index of the element that has a payload
        return queryResult.findIndex(element => element.hasOwnProperty('payload'));
    }
    return -1; // Return -1 if the array is empty or no element with payload is found
}
// function getJavaScriptObjectRepresentation(theObject) {
//     let result = null;
  
//     if (theObject !== null && theObject !== undefined) {
//     //   try {
//     //     //const toStringRepresentationOfObject = JSON.stringify(theObject);
//     //     Object.keys(theObject).forEach(key => {
//     //         theObject[key] = JSON.stringify(theObject[key]);
//     //     });

//         // for (const key in theObject) {
//         //     if (key === "context" || key === "session_params") {
//         //         theObject[key] = JSON.stringify(theObject[key]);
//         //     }
//         //   }
//         //   console.log("theObject",theObject);
//         // //   return theObject;
//         // function stringifyNestedObjects(theObject){
//         //   for (const key in theObject) {
//         //     if (typeof theObject[key] === "object") {
//         //         theObject[key] = JSON.stringify(theObject[key]);
//         //       stringifyNestedObjects(theObject[key]); // Recursively stringify nested objects
//         //     }
//         //   }
//         // }
//         function stringifySpecificObjects(obj, targetKeys = ["context", "session_params"]) {
//             for (const key in obj) {
//               if (typeof obj[key] === "object") {
//                 if (targetKeys.includes(key)) {
//                   obj[key] = JSON.stringify(obj[key]);
//                 } else {
//                   stringifySpecificObjects(obj[key], targetKeys); // Recursively process nested objects
//                 }
//               }
//             }
//         }
//          stringifySpecificObjects(theObject);

        
         
//           console.log("theObject",theObject);
//         return theObject;
//         // if (!theObject || theObject.trim() === '') {
//         //   // If the string representation is empty, set result to null
//         //   result = null;
//         // } else {
//           // Parse the JSON string back to a JavaScript object
//                   // result = toStringRepresentationOfObject;
//         // }
//     }
  
//     return result;
//   }
  
  // Usage example
//   const customPayload = {
//     customPayload: {
//       echoValue: 'Passing Json to Bot method1',
//       context: { /* ... */ },
//       session_params: { /* ... */ }
//     }
//   };
function getJObjectRepresentation(theObject) {
    if (theObject === null || theObject === undefined) {
      return null;
    }
  
    try {
      // Check for JSON string
      if (typeof theObject === 'string' && theObject.startsWith('{')) {
        return JSON.parse(theObject);
      } else {
        // Serialize object if not already JSON
        theObject=JSON.stringify(theObject);
        return JSON.parse(theObject);
      }
    } catch (error) {
      // Handle errors (logging, throw exception, etc.)
      console.error('Error converting object to JObject:', error);
      return null; // Or handle errors differently
    }
  }
//   const customPayloadObject = getJavaScriptObjectRepresentation(customPayload.customPayload);
function formatCustomPayload(payload) {
    const formattedPayload = {};

    Object.keys(payload).forEach(key => {
        // Specify the keys that should be stringified
        if (key === 'context' || key === 'session_params') {
            formattedPayload[key] = JSON.stringify(payload[key]);
        } else {
            // Keep other keys as they are
            formattedPayload[key] = payload[key];
        }
    });

    return {
        customPayload: formattedPayload
    };
}

module.exports={
    objectIsValidRichContentPrompt,
    convertStructuredFormatToOriginal,
    processPayload,
    findCustomPayloadIndex,
    getJObjectRepresentation,
    formatCustomPayload,
}
    