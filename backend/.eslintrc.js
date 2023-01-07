const path = require('path')

module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    project: path.dirname(__filename) + '/tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
