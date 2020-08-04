const jestPreset = require("@testing-library/react-native/jest-preset")

module.exports = {
  preset: "@testing-library/react-native",
  setupFiles: [
    "./jest/setupFile.js",
    ...jestPreset.setupFiles,
    "./node_modules/react-native-gesture-handler/jestSetup.js",
  ],
  collectCoverage: true,
  coverageReporters: ["lcov", "text-summary"],
  coverageDirectory: "test-coverage",
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native-community|react-native|react-native-linear-gradient|react-native-simple-crypto)/)",
  ],
  rootDir: "../",
  testPathIgnorePatterns: [
    "e2e",
    "node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
}
