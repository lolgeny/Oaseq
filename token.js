module.exports = {
  tokenTypes: {
    INTEGER: 1,
    FLOAT: 2,
    STRING: 3,
    OPERATOR: 4,
    VARIABLE: 5,
  },
  token: class {
    constructor(type, value) {
      this.type = type,
      this.value = value
    }
  },
}
