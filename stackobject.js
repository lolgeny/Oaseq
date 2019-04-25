module.exports = {
  stacktype: {
    NUMBER: 1,
    ARRAY: 2,
    SEQUENCE: 3
  },
  stackobject: class {
    constructor(value, type=module.exports.stacktype.NUMBER) {
      this.type = type;
      this.value = value;
    }
  }
}
