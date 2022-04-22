/* eslint-disable quote-props */
'use strict';

module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script'
  },
  plugins: [
    '@typescript-eslint',
    'prefer-arrow'
  ],
  rules: {
    'max-len': ['warn', { code: 120 }],
    'max-lines-per-function': ['warn', 50],
    'semi': ['error', 'always'],
    'eol-last': ['error', 'always'],
    'no-console': ['warn'],
    'strict': ['error', 'global'],
    'node/no-callback-literal': 'off',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0,
        maxBOF: 0
      }
    ],
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false
      }
    ],
    'prefer-arrow-callback': [
      'error',
      { allowNamedFunctions: true }
    ],
    'func-style': [
      'error',
      'expression',
      { allowArrowFunctions: true }
    ]
  }
};
