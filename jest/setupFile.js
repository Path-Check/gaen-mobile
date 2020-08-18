import mockAsyncStorage from "@react-native-community/async-storage/jest/async-storage-mock"
import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock.js"
import { NativeModules } from "react-native"

import { initializei18next } from "../src/locales/languages"

// Device locale mocks
NativeModules.SettingsManager = NativeModules.SettingsManager || {
  settings: { AppleLocale: "en_US" },
  I18nManager: { localeIdentifier: "en_US" },
}

// Secure storage manager
NativeModules.SecureStorageManager = NativeModules.SecureStorageManager || {
  getLocations: jest.fn(),
  migrateExistingLocations: jest.fn(),
}

// Exposure event emitter
NativeModules.ExposureEventEmitter = NativeModules.ExposureEventEmitter || {
  startListening: jest.fn(),
  addListener: jest.fn(),
}

jest.mock("react-native-linear-gradient")

// Silence YellowBox useNativeDriver warning
jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")

jest.mock("@react-native-community/async-storage", () => mockAsyncStorage)
jest.mock("@react-native-community/netinfo", () => mockRNCNetInfo)
jest.mock(
  "@react-native-community/push-notification-ios",
  () => "push-notification-ios",
)

initializei18next(["en"])
