/* eslint-env node */
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018, // or consider updating to 2020+ if needed
    sourceType: "module", // Changed to "module" for ES Modules
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