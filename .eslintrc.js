module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jest": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module"
  },
  "extends": [
    "eslint:recommended",
    "plugin:flowtype/recommended"
  ],
  "plugins": [
    "flowtype"
  ],
  "settings": {
    "flowtype": {
      "onlyFilesWithFlowAnnotation": true
    }
  }
}
