//Don't use for stack operations (e.g _)
var so = require('./stackobject');
module.exports = {
  '+': (a, b) => {
    //a:num + b:num
    if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
      sum = a.value+b.value;
      return new so.stackobject(sum);
    }
    //a:array + b:num
    if (a.type == so.stacktype.ARRAY && b.type == so.stacktype.NUMBER) {
      result = a.value.map(val => new so.stackobject(val.value + b.value, val.type));
      return new so.stackobject(result, so.stacktype.ARRAY);
    }
    //a:num + b:array
    if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.ARRAY) {
      result = b.value.map(val => new so.stackobject(val.value + a.value, val.type));
      return new so.stackobject(result, so.stacktype.ARRAY);
    }
    //a:array + b:array
    // BUG: does not return correct stack at end
    if (a.type == so.stacktype.ARRAY && b.type == so.stacktype.ARRAY) {
      result = a.value + b.value;
      return new so.stackobject(result, so.stacktype.ARRAY);
    };
  },
  '-': (a, b) => {
    //a:num - b:num
    if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
      difference = a.value-b.value;
      return new so.stackobject(difference);
    }
  },
  '*': (a, b) => {
    //a:num * b:num
    if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
      product = a.value*b.value;
      return new so.stackobject(product);
    }
  },
  '/': (a, b) => {
    //a:num / b:num
    if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
      ans = a.value/b.value;
      return new so.stackobject(ans);
    }
  },
  '%': (a, b) => {
    //a:num mod b:num
    if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
      ans = a.value%b.value;
      return new so.stackobject(ans);
    }
  },
  '^': (a, b) => {
    //a:num^b:num
    if (a.type == so.stacktype.NUMBER && b.type == so.stacktype.NUMBER) {
      pow = Math.pow(a.value,b.value);
      return new so.stackobject(pow);
    }
  },
  'e': (a, i) => {
    return new so.stackobject(a * Math.pow(10, i))
  }
}
