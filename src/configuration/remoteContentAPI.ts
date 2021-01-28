import { JsonDecoder } from "ts-data-json"

import * as Locale from "../locales/locale"
import Logger from "../logger"

const requestHeaders = {
  "content-type": "application/json",
  accept: "application/json",
}

export type Resource = Partial<Record<Locale.Locale, CustomCopy>> & {
  en: CustomCopy
}

export interface CustomCopy {
  healthAuthorityName: string
  welcomeMessage?: string
  about?: string
  legal?: string
  verificationCodeInfo?: string
  verificationCodeHowDoIGet?: string
  appTransition?: {
    header: string
    body1: string
    body2: string
  }
  callbackFormInstruction?: string
}

const AppTransitionCopyDecoder = JsonDecoder.object(
  {
    header: JsonDecoder.string,
    body1: JsonDecoder.string,
    body2: JsonDecoder.string,
  },
  "AppTransition",
)

const CustomCopyDecoder = JsonDecoder.object<CustomCopy>(
  {
    healthAuthorityName: JsonDecoder.string,
    welcomeMessage: JsonDecoder.optional(JsonDecoder.string),
    about: JsonDecoder.optional(JsonDecoder.string),
    legal: JsonDecoder.optional(JsonDecoder.string),
    verificationCodeInfo: JsonDecoder.optional(JsonDecoder.string),
    verificationCodeHowDoIGet: JsonDecoder.optional(JsonDecoder.string),
    appTransition: JsonDecoder.optional(AppTransitionCopyDecoder),
    callbackFormInstruction: JsonDecoder.optional(JsonDecoder.string),
  },
  "CustomCopy",
)

const ResourceDecoder = JsonDecoder.object<Resource>(
  {
    en: CustomCopyDecoder,
    ar: JsonDecoder.optional(CustomCopyDecoder),
    ch: JsonDecoder.optional(CustomCopyDecoder),
    da: JsonDecoder.optional(CustomCopyDecoder),
    el: JsonDecoder.optional(CustomCopyDecoder),
    es_419: JsonDecoder.optional(CustomCopyDecoder),
    es_PR: JsonDecoder.optional(CustomCopyDecoder),
    es: JsonDecoder.optional(CustomCopyDecoder),
    fil: JsonDecoder.optional(CustomCopyDecoder),
    fr: JsonDecoder.optional(CustomCopyDecoder),
    hmn: JsonDecoder.optional(CustomCopyDecoder),
    ht: JsonDecoder.optional(CustomCopyDecoder),
    id: JsonDecoder.optional(CustomCopyDecoder),
    it: JsonDecoder.optional(CustomCopyDecoder),
    ja: JsonDecoder.optional(CustomCopyDecoder),
    ko: JsonDecoder.optional(CustomCopyDecoder),
    ml: JsonDecoder.optional(CustomCopyDecoder),
    nl: JsonDecoder.optional(CustomCopyDecoder),
    pl: JsonDecoder.optional(CustomCopyDecoder),
    pt_BR: JsonDecoder.optional(CustomCopyDecoder),
    ro: JsonDecoder.optional(CustomCopyDecoder),
    ru: JsonDecoder.optional(CustomCopyDecoder),
    sk: JsonDecoder.optional(CustomCopyDecoder),
    so: JsonDecoder.optional(CustomCopyDecoder),
    tl: JsonDecoder.optional(CustomCopyDecoder),
    tr: JsonDecoder.optional(CustomCopyDecoder),
    ur: JsonDecoder.optional(CustomCopyDecoder),
    vi: JsonDecoder.optional(CustomCopyDecoder),
    zh_Hant: JsonDecoder.optional(CustomCopyDecoder),
  },
  "ResourceDecoder",
)

export type NetworkResponse<T, U> = NetworkSuccess<T> | NetworkFailure<U>

type NetworkSuccess<T> = {
  kind: "success"
  data: T
}

type NetworkFailure<Error> = {
  kind: "failure"
  error: Error
}

type RemoteCopyError = "Unknown"

export const fetchCustomCopy = async (
  baseUrl: string,
): Promise<NetworkResponse<Resource, RemoteCopyError>> => {
  const copyEndpoint = new URL("content/v1/copy.json", baseUrl).href

  try {
    const response = await fetch(copyEndpoint, {
      method: "GET",
      headers: requestHeaders,
    })
    const json = await response.json()
    const data = await ResourceDecoder.decodePromise(json)
    return { kind: "success", data }
  } catch (e) {
    switch (e.message) {
      default:
        Logger.error("Failed to fetch remote copy", e)
        return { kind: "failure", error: "Unknown" }
    }
  }
}
