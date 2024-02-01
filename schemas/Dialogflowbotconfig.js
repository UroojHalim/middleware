class DialogFlowBotConfig {
    /**
     * Bot service account JSON. If the BU has no service account configured, this field will be used.
     * Service account from DynamoDB table will take precedence over it.
     * @type {Object}
     */
    JSONServiceAccount = null;

    /**
     * DialogFlow project to connect to. This will be used in case of OEM service account.
     * @type {string}
     */
    CustomerGcpProject = null;

    /**
     * Language of the input and TTS output. Language is set during input query.
     * Use the language code to set the language.
     * https://cloud.google.com/dialogflow/docs/reference/language
     * @type {string}
     */
    Language = null;

    /**
     * Region of the dialogflow bot.
     * @type {string}
     */
    Region = null;

    /**
     * Environment of the dialogflow bot.
     * @type {string}
     */
    Environment = null;

    /**
     * If set true, proxy will generate the TTS output.
     * @type {boolean}
     */
    PerformOutputTTS = false;

    /**
     * If ON, DialogFlow will use this custom voice instead of taking TTS voice name into account to select a voice.
     * @type {boolean}
     */
    UseCustomVoice = false;

    /**
     * Name of the voice to be used for the TTS output.
     * @type {string}
     */
    TTSVoiceName = null;

    /**
     * Model to be used for the transcription of audio data sent to the agent.
     * @type {string}
     */
    Model = null;

    /**
     * Variant of the specified model to use.
     * See the Cloud Speech documentation (https://cloud.google.com/speech-to-text/docs/enhanced-models)
     * For example, the "phone_call" model has both a standard and an enhanced variant.
     * When you use an enhanced model, you will generally receive higher quality results than for a standard model.
     * @type {string}
     */
    ModelVariant = "UseBestAvailable";

    /**
     * The name of the AutoML model that synthesizes the custom voice.
     * @type {string}
     */
    CustomVoiceModel = null;

    /**
     * If set true, it will add the milliseconds of silence specified at the start of audio.
     * @type {string}
     */
    AddLeadingSilence = null;

    /**
     * Between range [0.25, 4.0]. 1.0 is normal, 2.0 is twice as fast, 0.5 is half as fast.
     * @type {number}
     */
    SpeakingRate = 1.0;

    /**
     * Semitones: Between range [-20.0, 20.0]. 20.0 means increase 20 semitones from original pitch. -20 means decrease 20 semitones from original pitch.
     * @type {number}
     */
    Pitch = 0.0;

    /**
     * Between range [-96.0, 16.0]. Volume gain (in DB) of the normal native volume supported by the specific voice.
     * A value of -6.0 will play at approx half the amplitude of the normal native signal amplitude.
     * A value of +6.0 will play at approx twice the amplitude of the normal native signal amplitude.
     * Recommendation: Not to exceed +10 (dB) as there's usually no effective increase in loudness for any value greater than that.
     * @type {number}
     */
    VolumeGain = 0.0;

    /**
     * Name of the dialog flow es event which should be triggered in case of a timeout.
     * Default fallback intent will be called if nothing is supplied.
     * @type {string}
     */
    TimeoutEvent = null;

    /**
     * If the contact enters these characters, the script takes the DTMFBreakout branch.
     * @type {string}
     */
    DTMFBreakOutPattern = null;

    /**
     * Use Google Protobuf JSON Serializer.
     * @type {boolean}
     */
    UseGoogleProtobufJsonSerializer = false;
}
