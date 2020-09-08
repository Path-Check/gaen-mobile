import "./all-dayjs-locales"

import dayjs from "dayjs"
import i18next, { Resource } from "i18next"
import { initReactI18next, useTranslation } from "react-i18next"
import { NativeModules, Platform } from "react-native"

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
import vi from "./vi.json"
import zh_Hant from "./zh_Hant.json"

// Refer this for checking the codes and creating new folders
// https://developer.chrome.com/webstore/i18n

// Adding/updating a language:
// 1. Add the language in Lokalise
// 2. run: yarn i18n:pull with your lokalise token,
//    see app/locales/pull.sh instructions
// 3. import xy from `./xy.json` and add the language to the language block

type Locale = string

function toIETFLanguageTag(locale: Locale): Locale {
  return locale.replace("_", "-").toLowerCase()
}

function getLanguageFromLocale(locale: Locale): Locale {
  const [languageCode] = toIETFLanguageTag(locale).split("-")
  return languageCode
}

async function setLocale(locale: Locale) {
  dayjs.locale(toIETFLanguageTag(locale))
  return await i18next.changeLanguage(locale)
}

type TextDirection = "ltr" | "rtl"

export function useLanguageDirection(): TextDirection {
  const { i18n } = useTranslation()
  return i18n.dir()
}

export async function setUserLocaleOverride(locale: Locale): Promise<void> {
  await setLocale(locale)
  await StorageUtils.setUserLocaleOverride(locale)
}

/* eslint-disable no-underscore-dangle */
const AVAILABLE_TRANSLATIONS: Resource = {
  ar: { label: ar._display_name, translation: ar },
  ch: { label: ch._display_name, translation: ch },
  da: { label: da._display_name, translation: da },
  el: { label: el._display_name, translation: el },
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
  vi: { label: vi._display_name, translation: vi },
  zh_Hant: { label: zh_Hant._display_name, translation: zh_Hant },
}

/** The known locale list */
export const getLocaleList = (): Array<{
  value: Locale
  label: string
}> => {
  const resources = i18next.options.resources
  if (!resources) {
    return []
  }
  return Object.entries(resources)
    .map(([langCode, lang]) => ({
      value: langCode,
      label: lang.label as string,
    }))
    .sort((a, b) => (a.value > b.value ? -1 : 1))
}

/** A map of locale code to name. */
export const getLocalNames = (): Record<Locale, string> => {
  const resources = i18next.options.resources
  if (!resources) {
    return {}
  }
  return Object.entries(resources).reduce(
    (output: Record<Locale, string>, [langCode, lang]) => {
      output[langCode] = lang.label as string
      return output
    },
    {},
  )
}

/** Get the device locale e.g. en_US */
function getDeviceLocale(): Locale {
  return Platform.OS === "ios"
    ? NativeModules.SettingsManager.settings.AppleLocale || // iOS < 13
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier // Android
}

/**
 * Find compatible supported i18n language
 *
 * e.g. device locale `en_AU` would find `en`
 *      device locale `pt_BR` would find `pt-BR`
 */
export function supportedDeviceLanguageOrEnglish(): Locale {
  const locale = getDeviceLocale() // en_US
  const langCode = getLanguageFromLocale(locale) // en
  const localeNames = getLocalNames()
  const found = Object.keys(localeNames).find(
    (l) => l === langCode || toIETFLanguageTag(l) === toIETFLanguageTag(locale),
  )
  return found || "en"
}

const FALLBACK_TRANSLATION_RESOURCES = {
  en: { label: en._display_name, translation: en },
}

const languageResources = (withLocales: Locale[]): Resource => {
  const requestedTranslationResources = Object.keys(AVAILABLE_TRANSLATIONS)
    .filter((key) => withLocales.includes(key))
    .reduce((obj: Resource, key: Locale) => {
      obj[key] = AVAILABLE_TRANSLATIONS[key]
      return obj
    }, {})

  return { ...requestedTranslationResources, ...FALLBACK_TRANSLATION_RESOURCES }
}

export const initializei18next = (withLocales: Locale[]): void => {
  const config = {
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: "en", // this is for initialization purposes only
    fallbackLng: "en",
    returnEmptyString: false,
    resources: {
      ...languageResources(withLocales),
    },
  }

  i18next.use(initReactI18next).init(config)
}

export const loadUserLocale = async (): Promise<void> => {
  StorageUtils.getUserLocaleOverride().then((locale) => {
    setLocale(locale || supportedDeviceLanguageOrEnglish())
  })
}

export default i18next

// do not remove, this will force the yarn i18n:extract to export this key
i18next.t("_display_name")
