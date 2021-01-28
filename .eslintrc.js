module.exports = {
  root: true,
  extends: [
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jest/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "prettier",
    "react",
    "react-hooks",
    "react-native",
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {},
    },
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  env: {
    "react-native/react-native": true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
    "jest/globals": true,
    mocha: true,
  },
  ignorePatterns: ["android/**", "ios/**"],
  rules: {
    // 0 is for off, 1 is for warning, 2 is for error
    "eol-last": 2, // Require file to end with single newline
    "no-import-assign": 1,
    "no-constant-condition": 2, // Disallow use of constant expressions in conditions
    "no-dupe-keys": 2, // Disallow Duplicate Keys
    "no-empty": 2, // Disallow Empty Block Statements
    "no-extra-boolean-cast": 2, // Disallow Extra Boolean Casts
    "no-extra-semi": 0,
    "no-prototype-builtins": 2, // Disallow use of Object.prototypes builtins directly
    "no-undef": 2, // Disallow Undeclared Variables
    "no-underscore-dangle": 2, // Disallow dangling underscores in identifiers
    "no-unreachable": 2, // Disallow unreachable code after return, throw, continue, and break statements
    "no-unused-vars": [2, { argsIgnorePattern: "^_" }], // Disallow Unused Variables
    "no-useless-escape": 2, // Disallow unnecessary escape usage
    "no-console": 0, // disallow the use of console
    "no-var": 2, // require let or const instead of var
    strict: [2, "global"], // require or disallow strict mode directives
    "react-native/no-color-literals": 1, // Detect StyleSheet rules and inline styles containing color literals instead of variables
    "react-native/no-inline-styles": 0, // For keeping styles away from the logic, we can switch it to 1 in future
    "react-native/no-raw-text": ["error", { skip: ["Trans"] }], // This is to make sure everything is translated in the app
    "react-native/no-unused-styles": 1, // Detect StyleSheet rules which are not used in your React components
    "react/jsx-boolean-value": 2, // Enforce boolean attributes notation in JSX (fixable)
    "react/jsx-key": 2, // Report missing key props in iterators/collection literals
    "react/jsx-no-duplicate-props": 2, // Enforce no duplicate props
    "react/jsx-no-undef": 2, // Disallow undeclared variables in JSX
    "react/jsx-sort-props": 0, // Enforce props alphabetical sorting (fixable)
    "react/jsx-wrap-multilines": 2, // Prevent missing parentheses around multilines JSX (fixable)
    "react/no-deprecated": 1, // Prevent usage of deprecated methods
    "react/no-did-mount-set-state": 1, // Prevent usage of setState in componentDidMount
    "react/no-did-update-set-state": 1, // Prevent usage of setState in componentDidUpdate
    "react/no-multi-comp": 0, // Prevent multiple component definition per file
    "react/no-string-refs": 1, // Prevent string definitions for references and prevent referencing this.refs
    "react/prop-types": 0, // Prevent missing props validation in a React component definition
    "react/react-in-jsx-scope": 2, // Prevent missing React when using JSX
    "react/self-closing-comp": 2, // Prevent extra closing tags for components without children,
    "react/prefer-stateless-function": 2, // Use functional components vs classes
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-empty-function": [2, { allow: ["arrowFunctions"] }],
    "@typescript-eslint/no-extra-semi": 0,
    "@typescript-eslint/no-unused-vars": [2, { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": 0,
  },
  overrides: [
    {
      files: ["*.spec.js"], // Or *.test.js
      rules: {
        "react-native/no-raw-text": 0,
      },
    },
    {
      // enable the rule specifically for TypeScript files
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": ["error"],
      },
    },
  ],
  globals: {
    Response: "readonly",
    RequestInfo: "readonly",
    RequestInit: "readonly",
  },
}
