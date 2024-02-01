const CustomExchangeResponse_V1 = require("../../schemas/CustomExchangeResponse_V1");
const PromptDefinition = require("../../schemas/PromptDefinition");
const userInputType = require("../../schemas/UserInputType");


const Route =  async (req, res) => {
   var botExchangeResponse = new CustomExchangeResponse_V1();
    botExchangeResponse.nextPromptBehaviours = null;
    let userInput = req.body.userInput;
    let prompts = [new PromptDefinition];

    if (req.body.userInputType == userInputType.AUTOMATED_TEXT) {
        botExchangeResponse.intentInfo.intent = "WELCOME"
        botExchangeResponse.intentInfo.intentConfidence = 100

        prompts[0].transcript = userInput;
    }
    //For Text 
    else if (req.body.userInputType == userInputType.TEXT) {
        botExchangeResponse.intentInfo.intent = "NLU_NEEDED"
        botExchangeResponse.intentInfo.intentConfidence = 100
        prompts[0].transcript = userInput;
        prompts[0].textToSpeech = userInput;
    }
    //For Audio
    else if (req.body.userInputType == userInputType.BASE64_ENCODED_G711_ULAW_WAV_FILE) {
        debug("TREATMENT: base64 audio");
        var base64WavFile = req.body.base64WavFile;
        if (base64WavFile != "") {
            prompts[0].base64EncodedG711ulawWithWavHeader = base64WavFile;

        }
        else {
            prompts[0].transcript = "NO AUDIO FOUND";
        }

    }
    //For No input
    else if (req.body.userInputType == userInputType.NO_INPUT) {
        debug("TREATMENT: no input");
        if (mediaType == "voip") {
            prompts[0].base64EncodedG711ulawWithWavHeader = req.body.base64WavFile;

        }

        botExchangeResponse.intentInfo.intent = "NLU_NEEDED"
        botExchangeResponse.intentInfo.intent_confidence = 100
        promptDefinition[0].transcript = userInput
    }

    botExchangeResponse.nextPromptSequence.prompts = prompts;
    return res.json(botExchangeResponse)
}

export default Route;

