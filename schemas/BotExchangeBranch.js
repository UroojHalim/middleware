const BotExchangeBranch = {
  DoNotBegin:0,
  PromptAndCollectNextResponse:1,
  ReturnControlToScript:2,
  EndContact:3,
  AudioInputUntranscribeable:4,
  Error:5,
 DTMF_Breakout_Branch:6,
  UserInputTimeout:7,
  UserInputNotUnderstood:8
}

module.exports = BotExchangeBranch;