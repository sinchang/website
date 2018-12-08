module.exports = {
  "env": {
    "browser": true,
    "es6": true,
  },
  "parser": "babel-eslint",
  "plugins": [
    "react",
  ],
  "globals": {
    "graphql": false,
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": true,
    "ecmaFeatures": {
      "jsx": true,
    },
  }
}