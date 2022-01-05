module.exports = {
  env: {
    es2021: true,
    "browser": true,
    "amd": true,
    "node": true,
    "mocha": true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    quotes: ["error", "double"],
    "no-shadow": "warn",
    "no-console": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "import/no-unresolved": "off",
    "import/extensions": "off",
  },
};
