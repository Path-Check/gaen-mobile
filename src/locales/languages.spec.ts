import { NativeModules } from "react-native"

import {
  supportedDeviceLanguageOrEnglish,
  initializei18next,
  getLocalNames,
} from "./languages"

const BACKUP_SETTINGS_MANAGER = NativeModules.SettingsManager

const setDeviceLocale = (locale: string) => {
  NativeModules.SettingsManager = {
    settings: { AppleLocale: locale },
    I18nManager: { localeIdentifier: locale },
  }
}

describe("supportedDeviceLanguageOrEnglish", () => {
  afterEach(() => {
    NativeModules.SettingsManager = BACKUP_SETTINGS_MANAGER
  })

  it("resolves device locale en -> en", () => {
    initializei18next(["en"])
    setDeviceLocale("en")
    expect(supportedDeviceLanguageOrEnglish()).toBe("en")
  })

  it("resolves device locale en-uS -> en", () => {
    initializei18next(["en"])
    setDeviceLocale("en_US")
    expect(supportedDeviceLanguageOrEnglish()).toBe("en")
  })

  it("resolves device locale zh_Hant -> zh_Hant", () => {
    initializei18next(["zh_Hant"])
    setDeviceLocale("zh_Hant")
    expect(supportedDeviceLanguageOrEnglish()).toBe("zh_Hant")
  })

  it("resolves device locale zh-Hant -> zh_Hant", () => {
    initializei18next(["zh_Hant"])
    setDeviceLocale("zh-Hant")
    expect(supportedDeviceLanguageOrEnglish()).toBe("zh_Hant")
  })

  it("resolves unknown device locale xx-yy -> en", () => {
    initializei18next(["en"])
    setDeviceLocale("xx0-yy")
    expect(supportedDeviceLanguageOrEnglish()).toBe("en")
  })
})

describe("initializei18next", () => {
  it("sets the languages to the ones provided plus the default ones", () => {
    const requestedLocales = ["el", "es"]
    initializei18next(requestedLocales)
    expect(Object.keys(getLocalNames())).toEqual([...requestedLocales, "en"])
  })

  it("defaults to the fallback list if no locale is specified", () => {
    const defaultLocales = ["en"]
    initializei18next(["not a valid one"])
    expect(Object.keys(getLocalNames())).toEqual(defaultLocales)
  })
})
