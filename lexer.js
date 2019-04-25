var token = require('./token');
module.exports = {
  lex: code => {
    console.log('Lexing code');
    code = code + ' ';
    tokens = [];
    numMode = false, stringMode = false, opMode = false, arrayMode = false, sequenceMode = false;
    tempNum = '', tempString = '';
    for (i = 0; i < code.length; i++) {
      currentChar = code[i];
      nextChar = code[i+1];
      console.log('CurrentChar:', currentChar, 'NextChar', nextChar);
      console.log('num',numMode,'str',stringMode,'op',opMode,'arr',arrayMode,'seq',sequenceMode);
      switch(true) {
        case numMode:
          if (currentChar == ' ') {
            tokens.push(new token.token(token.tokenTypes.INTEGER, tempNum));
            numMode = false;
          } else {
            if (/[\d.~]/.test(nextChar)) {
              tempNum += currentChar;
            } else {
              console.log('found end of number');
              tempNum += currentChar;
              tempNum = tempNum.replace('~', '-');
              console.log('tempNum',tempNum);
              if (tempNum.includes('.')) {
                console.log('float');
                tokens.push(new token.token(token.tokenTypes.FLOAT, tempNum));
              } else {
                console.log('int');
                tokens.push(new token.token(token.tokenTypes.INTEGER, tempNum));
              }
              numMode = false;
            }
          };
          break;
        default:
          switch(true) {
            case /[\d.~]/.test(currentChar):
              console.log('found a number');
              if (/[\d.~]/.test(nextChar)) {
                console.log('more than 1 digit');
                numMode = true;
                tempNum = currentChar;
              } else {
                console.log('only 1 digit');
                tokens.push(new token.token(token.tokenTypes.INTEGER, parseInt(currentChar)));
              }
              break;
            case /[\+\-\*/\%\_\^\\\@e\(\)\[\]]/.test(currentChar):
              console.log('found an operator');
              tokens.push(new token.token(token.tokenTypes.OPERATOR, currentChar));
            default:
              console.log('not sure; might be a space');
          }
      }
    }
    console.log('Lexed. Tokens:');
    tokens.forEach(t => console.log(t.type, t.value));
    return tokens;
  }
}
