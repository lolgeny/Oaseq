var fs = require('fs');

args = process.argv;
console.log("OASEQ DEVELOPMENT VERSION -----------------------------");
console.log('Reading file', args[2]);

fs.readFile(args[2], (err, data) => {
  code = data;
  //lexing
  var lex = require('./lexer');
  tokens = lex.lex(code);

  //Evaluation
  var so = require('./stackobject');
  var eval = require('./evaluator');
  let stack = [];
  console.log('OASEQ OUTPUT  __________________________________________________________________________');
  output = eval.evaluate(tokens, stack, stack);
  printOutput = output => {
    returnString = '';
    output.forEach(o => {
      switch(o.type) {
        case so.stacktype.NUMBER:
          returnString += o.value + '\n';
          break;
        case so.stacktype.ARRAY:
          returnString += '[' + printOutput(o.value).split('\n').join(', ') + ']\n';
          break;
        }
    });
    if (returnString.slice(-1)[0] == '\n') returnString = returnString.slice(0,-1);
    return returnString;
  };
  console.log(printOutput(output));
});
