const { Struct, Value } = require('@google-cloud/protobuf');

function parseCustomPayload(detectRequest, customPayload, projectId, sessionId) {
    let payload = new Struct();

    const json = JSON.parse(customPayload);

    for (const [key, value] of Object.entries(json)) {
        const lowerKey = key.toLowerCase();

        if (lowerKey === "context") {
            // Add Contexts
            addContexts(detectRequest, value, projectId, sessionId);
        } else if (lowerKey === "contexttoclear") {
            // Clear Contexts
            clearContexts(detectRequest, value, projectId, sessionId);
        } else if (Array.isArray(value)) {
            // Parse array - use recursion
            const tempPayload = new Struct();
            const tmp = [];

            for (const temp of value) {
                parseCustomPayload(detectRequest, JSON.stringify(temp), tempPayload, projectId, sessionId);
                tmp.push(Value.forStruct(tempPayload));
            }

            payload.fields[key] = Value.forList(tmp);
        } else if (value && typeof value === 'object') {
            // Parse JSON
            const tempPayload = new Struct();
            const tempDict = JSON.parse(JSON.stringify(value)); // Deep copy

            for (const [tempKey, tempValue] of Object.entries(tempDict)) {
                if (tempValue !== null) {
                    tempPayload.fields[tempKey] = Value.forString(tempValue.toString());
                }
            }

            payload.fields[key] = Value.forStruct(tempPayload);
        } else {
            // Parse string
            payload.fields[key] = Value.forString(value.toString());
        }
    }

    return payload;
}

// Example asynchronous functions
async function addContexts(detectRequest, value, projectId, sessionId) {
    // Implement the logic for adding contexts
}

async function clearContexts(detectRequest, value, projectId, sessionId) {
    // Implement the logic for clearing contexts
}
const { Struct } = require('@google-cloud/protobuf');
const { QueryParameters } = require('your-protobuf-package'); // Replace with the actual protobuf package

function processCustomPayloadFromScriptToBot(detectRequest, sessionID, projectID, customPayload, error) {
    error = "";

    if (!customPayload) {
        return true;
    }

    const customPayloadAsJson = JSON.stringify(customPayload);

    try {
        const pay = new Struct();
        detectRequest.queryParams = new QueryParameters({
            payload: new Struct()
        });

        parseCustomPayload(detectRequest, customPayloadAsJson, pay, projectID, sessionID);

        detectRequest.queryParams.payload = pay;
        return true;
    } catch (ex) {
        error = ex.message;
        return false;
    }
}

// Assuming parseCustomPayload is defined as in the previous response
