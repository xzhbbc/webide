const path = require('path')
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    // "prettier/@typescript-eslint",
    // "prettier/react"
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    Promise: true,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },
    project: path.resolve(process.cwd(), "./tsconfig.json")
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "no-useless-escape": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    // "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-empty-function": "off",
    "no-irregular-whitespace": "off",
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
  overrides: [
    {
      files: ["*.tsx", "*.ts"],
      rules: {
        'no-unused-vars': 'off',
        "react/prop-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/camelcase": [
          "off"
        ],
        '@typescript-eslint/ban-types': [
          'error',
          {
            'types': {
              'Function': false
            }
          }
        ]
      }
    }
  ],
  settings: {
    react: {
      version: "detect"
    }
  }
}
