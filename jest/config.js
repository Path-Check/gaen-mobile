module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  setupFiles: [
    "./jest/setupFile.js",
    "./node_modules/react-native-gesture-handler/jestSetup.js",
  ],
  testEnvironment: "jsdom",
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
    "node_modules/(?!(@react-native-community|react-native|react-native-linear-gradient|react-native-simple-crypto|react-native-flash-message|react-native-iphone-x-helper)/)",
  ],
  rootDir: "../",
  testPathIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native-community|@react-navigation)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
}
