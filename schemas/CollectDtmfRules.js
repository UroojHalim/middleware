module.exports = class CollectDtmfRules {
  detectDtmf=true;
  clearDigits=false;
  terminationCharacters;
  stripTerminator=true;
  interDigitTimeoutMilliseconds=0;
  maxDigits=0;
}