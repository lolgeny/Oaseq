var token = require('./token');
var so = require('./stackobject');
var fc = require('./functions');
module.exports = {
  evaluate: (tokens, stack, currentList) => {
    tokens.forEach((t, index) => {
      switch(t.type) {
        case token.tokenTypes.INTEGER:
          currentList.push(new so.stackobject(parseInt(t.value)));
          break;
        case token.tokenTypes.FLOAT:
          currentList.push(new so.stackobject(parseFloat(t.value)));
          break;
        case token.tokenTypes.OPERATOR:
          switch(t.value) {
            case '+':
            //arity 2
              b = stack.pop();
              a = stack.pop();
              currentList.push(fc['+'](a,b));
              break;
            case '-':
            //arity 2
              b = stack.pop();
              a = stack.pop();
              currentList.push(fc['-'](a,b));
              break;
            case '*':
            //arity 2
              b = stack.pop();
              a = stack.pop();
              currentList.push(fc['*'](a,b));
              break;
            case '/':
            //arity 2
              b = stack.pop();
              a = stack.pop();
              currentList.push(fc['*'](a,b));
              break;
            case '%':
            //arity 2
              b = stack.pop();
              a = stack.pop();
              currentList.push(fc['%'](a,b));
              break;
            case '^':
            //arity 2
              b = stack.pop();
              a = stack.pop();
              currentList.push(fc['^'](a,b));
              break;
            case '_':
            //arity 1
              a = stack.slice(-1)[0];
              currentList.push(a);
              break;
            case '\\':
            //arity 2
              a = stack.pop();
              b = stack.pop();
              currentList.push(a);
              currentList.push(b);
              break;
            case '@':
            //arity 3
              a = stack.pop();
              b = stack.pop();
              c = stack.pop();
              currentList.push(b);
              currentList.push(a);
              currentList.push(c);
              break;
            case 'e':
            //arity 1 + infix
              a = stack.pop().value;
              i = tokens[index+1].value;
              tokens.splice(index+1, 1);
              currentList.push(fc.e(a, i));
              break;
            case '(':
            //arity 1
              a = stack.pop();
              //a:num
              if (a.type == so.stacktype.NUMBER) currentList.push(new so.stackobject(a.value - 1));
              break;
            case ')':
            //arity 1
              a = stack.pop();
              if (a.type == so.stacktype.NUMBER) currentList.push(new so.stackobject(a.value + 1));
              break;
            case '[':
              nestLevel = 0;
              toGo = [];
              i = index;
              do {
                if (tokens[i].value == '[') nestLevel += 1;
                if (tokens[i].value == ']') nestLevel -= 1;
                toGo.push(tokens[i]);
                i++;
                if (i > tokens.length && nestLevel != 0) {
                  i--;
                  while (nestLevel != 0) {
                    toGo.push(new token.token(token.tokenTypes.OPERATOR, ']'));
                    nestLevel -= 1;
                  }
                };
              } while (nestLevel != 0);
              tokens.splice(index, i-1-index);
              newArr = [];
              newArr = module.exports.evaluate(toGo.slice(1,-1), stack, newArr);
              currentList.push(new so.stackobject(newArr, so.stacktype.ARRAY));
          }
      }
    });
    return currentList;
  }
}
