import env from "react-native-config"

import { ExposureKey } from "../exposureKey"

const exposureUrl = env.POST_DIAGNOSIS_KEYS_URL

const defaultHeaders = {
  "content-type": "application/json",
  accept: "application/json",
}

const EXISTING_KEYS_SENT_RESPONSE = "no revision token, but sent existing keys"

type Token = string

interface PostKeysResponseBody {
  error: string
  insertedExposures: number
  padding: string
  revisionToken: Token
}

export enum PostKeysError {
  Unknown = "Unknown",
  RequestFailed = "RequestFailed",
}

export type PostKeysFailure = {
  nature: PostKeysError
  message: string
}

export type PostKeysSuccess = {
  revisionToken: Token
}

export enum PostKeysNoOpReason {
  NoTokenForExistingKeys = "NoTokenForExistingKeys",
}

export type PostKeysNoOp = {
  reason: PostKeysNoOpReason
  newKeysInserted: number
  message: string
}

type PostKeysResponse = PostKeysSuccess | PostKeysNoOp

type RegionCode = string

const DEFAULT_PADDING = ""

export const postDiagnosisKeys = async (
  exposureKeys: ExposureKey[],
  regionCodes: RegionCode[],
  certificate: Token,
  hmacKey: string,
  appPackageName: string,
  revisionToken: string,
): Promise<PostKeysResponse | PostKeysFailure> => {
  const data = {
    temporaryExposureKeys: exposureKeys,
    regions: regionCodes,
    appPackageName,
    verificationPayload: certificate,
    hmackey: hmacKey,
    padding: DEFAULT_PADDING,
    revisionToken,
  }

  try {
    const response = await fetch(exposureUrl, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(data),
    })

    const json: PostKeysResponseBody = await response.json()
    if (response.ok) {
      return { revisionToken: json.revisionToken }
    } else {
      switch (json.error) {
        case EXISTING_KEYS_SENT_RESPONSE: {
          return {
            reason: PostKeysNoOpReason.NoTokenForExistingKeys,
            newKeysInserted: json.insertedExposures || 0,
            message: json.error,
          }
        }
        default: {
          return { nature: PostKeysError.Unknown, message: json.error }
        }
      }
    }
  } catch (e) {
    return { nature: PostKeysError.RequestFailed, message: e.message }
  }
}
