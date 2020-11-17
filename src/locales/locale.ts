export type Locale =
  | "ar"
  | "ch"
  | "da"
  | "el"
  | "en"
  | "es_419"
  | "es_PR"
  | "es"
  | "fil"
  | "fr"
  | "hmn"
  | "ht"
  | "id"
  | "it"
  | "ja"
  | "ko"
  | "ml"
  | "nl"
  | "pl"
  | "pt_BR"
  | "ro"
  | "ru"
  | "sk"
  | "so"
  | "tl"
  | "ur"
  | "vi"
  | "zh_Hant"

export const toIETFLanguageTag = (locale: Locale): string => {
  switch (locale) {
    case "es_419": {
      return "es"
    }
    case "es_PR": {
      return "es-pr"
    }
    case "fil": {
      return "tl-ph"
    }
    case "hmn": {
      return "en"
    }
    case "pt_BR": {
      return "pt-br"
    }
    case "so": {
      return "en"
    }
    case "tl": {
      return "tl-ph"
    }
    case "zh_Hant": {
      return "zh"
    }
    default: {
      return locale
    }
  }
}

export const fromString = (l: string): Locale => {
  switch (l) {
    case "ar": {
      return "ar"
    }
    case "ch": {
      return "ch"
    }
    case "da": {
      return "da"
    }
    case "el": {
      return "el"
    }
    case "en": {
      return "en"
    }
    case "es_419": {
      return "es_419"
    }
    case "es-PR":
    case "es_PR": {
      return "es_PR"
    }
    case "es": {
      return "es"
    }
    case "fil": {
      return "fil"
    }
    case "fr": {
      return "fr"
    }
    case "hmn": {
      return "hmn"
    }
    case "ht": {
      return "ht"
    }
    case "id": {
      return "id"
    }
    case "it": {
      return "it"
    }
    case "ja": {
      return "ja"
    }
    case "ko": {
      return "ko"
    }
    case "ml": {
      return "ml"
    }
    case "nl": {
      return "nl"
    }
    case "pl": {
      return "pl"
    }
    case "pt-BR":
    case "pt_BR": {
      return "pt_BR"
    }
    case "ro": {
      return "ro"
    }
    case "ru": {
      return "ru"
    }
    case "sk": {
      return "sk"
    }
    case "so": {
      return "so"
    }
    case "tl-ph":
    case "tl": {
      return "tl"
    }
    case "ur": {
      return "ur"
    }
    case "vi": {
      return "vi"
    }
    case "zh_Hant": {
      return "zh_Hant"
    }
    default: {
      return "en"
    }
  }
}
