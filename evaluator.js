var token = require('./token');
var so = require('./stackobject')
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
              //a:num + b:num
              if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
                sum = a.value+b.value;
                currentList.push(new so.stackobject(sum));
              }
              //a:array + b:num
              if (a.type == so.stacktype.ARRAY && b.type == so.stacktype.NUMBER) {
                result = a.value.map(val => new so.stackobject(val.value + b.value, val.type));
                currentList.push(new so.stackobject(result, so.stacktype.ARRAY));
              }
              //a:num + b:array
              if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.ARRAY) {
                result = b.value.map(val => new so.stackobject(val.value + a.value, val.type));
                currentList.push(new so.stackobject(result, so.stacktype.ARRAY));
              }
              //a:array + b:array
              // BUG: does not return correct stack at end
              if (a.type == so.stacktype.ARRAY && b.type == so.stacktype.ARRAY) {
                result = a.value + b.value;
                currentList.push(new so.stackobject(result, so.stacktype.ARRAY));
              }
              break;
            case '-':
            //arity 2
              b = stack.pop();
              a = stack.pop();
              //a:num - b:num
              if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
                difference = a.value-b.value;
                currentList.push(new so.stackobject(difference));
              }
              break;
            case '*':
            //arity 2
              b = stack.pop();
              a = stack.pop();
              //a:num * b:num
              if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
                product = a.value*b.value;
                currentList.push(new so.stackobject(product));
              }
              break;
            case '/':
            //arity 2
              b = stack.pop();
              a = stack.pop();
              //a:num / b:num
              if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
                ans = a.value/b.value;
                currentList.push(new so.stackobject(ans));
              }
              break;
            case '%':
            //arity 2
              b = stack.pop();
              a = stack.pop();
              //a:num mod b:num
              if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
                ans = a.value%b.value;
                currentList.push(new so.stackobject(ans));
              }
              break;
            case '^':
            //arity 2
              b = stack.pop();
              a = stack.pop();
              //a:num^b:num
              if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
                pow = Math.pow(a.value,b.value);
                currentList.push(new so.stackobject(pow));
              }
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
              currentList.push(new so.stackobject(a * Math.pow(10, i)));
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
