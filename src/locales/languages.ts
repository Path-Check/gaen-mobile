import { NativeModules, Platform } from "react-native"
import env from "react-native-config"
import i18next, { ResourceLanguage } from "i18next"
import { useTranslation, initReactI18next } from "react-i18next"
import dayjs from "dayjs"

import "./dayjs-locales"
import * as Locale from "./locale"
import { StorageUtils } from "../utils"

import ar from "./ar.json"
import ch from "./ch.json"
import da from "./da.json"
import el from "./el.json"
import en from "./en.json"
import es_419 from "./es_419.json"
import es_PR from "./es_PR.json"
import es from "./es.json"
import fil from "./fil.json"
import fr from "./fr.json"
import hmn from "./hmn.json"
import ht from "./ht.json"
import id from "./id.json"
import it from "./it.json"
import ja from "./ja.json"
import ko from "./ko.json"
import ml from "./ml.json"
import nl from "./nl.json"
import pl from "./pl.json"
import pt_BR from "./pt_BR.json"
import ro from "./ro.json"
import ru from "./ru.json"
import sk from "./sk.json"
import so from "./so.json"
import tl from "./tl.json"
import ur from "./ur.json"
import vi from "./vi.json"
import zh_Hant from "./zh_Hant.json"

// Refer this for checking the codes and creating new folders
// https://developer.chrome.com/webstore/i18n

// Adding/updating a language:
// 1. Add the language in Lokalise
// 2. run: yarn i18n:pull with your lokalise token,
//    see app/locales/pull.sh instructions
// 3. import xy from `./xy.json` and add the language to the language block

type Resource = Record<Locale.Locale, ResourceLanguage>

/* eslint-disable no-underscore-dangle */
const LANGUAGE_RESOURCES: Resource = {
  ar: { label: ar._display_name, translation: ar },
  ch: { label: ch._display_name, translation: ch },
  da: { label: da._display_name, translation: da },
  el: { label: el._display_name, translation: el },
  en: { label: en._display_name, translation: en },
  es: { label: es._display_name, translation: es },
  es_PR: { label: es_PR._display_name, translation: es_PR },
  es_419: { label: es_419._display_name, translation: es_419 },
  ht: { label: ht._display_name, translation: ht },
  fil: { label: fil._display_name, translation: fil },
  fr: { label: fr._display_name, translation: fr },
  hmn: { label: hmn._display_name, translation: hmn },
  id: { label: id._display_name, translation: id },
  it: { label: it._display_name, translation: it },
  ja: { label: ja._display_name, translation: ja },
  ko: { label: ko._display_name, translation: ko },
  ml: { label: ml._display_name, translation: ml },
  nl: { label: nl._display_name, translation: nl },
  pl: { label: pl._display_name, translation: pl },
  pt_BR: { label: pt_BR._display_name, translation: pt_BR },
  ro: { label: ro._display_name, translation: ro },
  ru: { label: ru._display_name, translation: ru },
  sk: { label: sk._display_name, translation: sk },
  so: { label: so._display_name, translation: so },
  tl: { label: tl._display_name, translation: tl },
  ur: { label: ur._display_name, translation: ur },
  vi: { label: vi._display_name, translation: vi },
  zh_Hant: { label: zh_Hant._display_name, translation: zh_Hant },
}

export const initializei18next = (): void => {
  const config = {
    interpolation: {
      escapeValue: false,
    },
    lng: "en",
    fallbackLng: "en",
    returnEmptyString: false,
    resources: LANGUAGE_RESOURCES,
  }

  i18next.use(initReactI18next).init(config)
}

// Required translations keys for `yarn i18n:extract`
i18next.t("_display_name")

// Locale Storage
export const loadUserLocale = async (): Promise<void> => {
  const userLocale = await StorageUtils.getUserLocaleOverride()

  if (userLocale) {
    const locale = Locale.fromString(userLocale)
    setLocale(locale)
  } else {
    const deviceLocale = supportedDeviceLanguageOrEnglish()
    setLocale(deviceLocale)
  }
}

export async function setUserLocaleOverride(
  locale: Locale.Locale,
): Promise<void> {
  await setLocale(locale)
  await StorageUtils.setUserLocaleOverride(locale)
}

async function setLocale(locale: Locale.Locale) {
  const iETFLanguageTag = Locale.toIETFLanguageTag(locale)
  dayjs.locale(iETFLanguageTag)

  return await i18next.changeLanguage(locale)
}

// Device Locale
export function supportedDeviceLanguageOrEnglish(): Locale.Locale {
  const l = deviceLocale()
  const languageCode = l.replace("-", "_")
  const locale = Locale.fromString(languageCode)

  const envLocales = env.SUPPORTED_LOCALES
  const enabledLocales = parseEnvLocales(envLocales)
  const result = enabledLocales.includes(locale) ? locale : "en"
  return result
}

const deviceLocale = (): string => {
  return Platform.OS === "ios"
    ? NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier
}

// View Helpers
export const enabledLocales = (): Array<{
  value: Locale.Locale
  label: string
}> => {
  const envLocales = env.SUPPORTED_LOCALES
  const locales = parseEnvLocales(envLocales)
  return locales.map((locale) => {
    return {
      value: locale,
      label: LANGUAGE_RESOURCES[locale].label as string,
    }
  })
}

const parseEnvLocales = (envLocales = ""): Locale.Locale[] => {
  const localeStrings = envLocales.split(",")
  return localeStrings.map(Locale.fromString)
}

interface LocaleInfo {
  localeCode: string
  languageName: string
}

export const useLocaleInfo = (): LocaleInfo => {
  const {
    i18n: { language: localeCode },
  } = useTranslation()
  const locale = Locale.fromString(localeCode)
  const languageName = LANGUAGE_RESOURCES[locale].label as string
  return { localeCode, languageName }
}

export default i18next
