import * as english from "../../src/locales/en.json"

const languageStrings = {
  "en-US": english,
}

export const languages = Object.entries(
  languageStrings,
).map(([locale, strings]) => [locale, { ...english, ...strings }])
