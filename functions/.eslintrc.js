/* eslint-env node */
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "script", // Use "script" for CommonJS
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
    // Override for the ESLint config file to disable no-undef for CommonJS globals
    {
      files: [".eslintrc.js"],
      env: {
        node: true,
      },
      rules: {
        "no-undef": "off",
      },
    },
  ],
  globals: {},
};
