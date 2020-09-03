import env from "react-native-config"

import { ExposureKey } from "../exposureKey"
import { fetchWithTimeout, TIMEOUT_ERROR } from "./fetchWithTimeout"

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
  Timeout = "Timeout",
}

export type PostKeysFailure = {
  kind: "failure"
  nature: PostKeysError
  message: string
}

export type PostKeysSuccess = {
  kind: "success"
  revisionToken: Token
}

export enum PostKeysNoOpReason {
  NoTokenForExistingKeys = "NoTokenForExistingKeys",
}

export type PostKeysNoOp = {
  kind: "no-op"
  reason: PostKeysNoOpReason
  newKeysInserted: number
  message: string
}

type PostKeysResponse = PostKeysSuccess | PostKeysNoOp

type RegionCode = string

const DEFAULT_PADDING = ""
const TIMEOUT = 5000

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
    const response = (await fetchWithTimeout(
      exposureUrl,
      {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(data),
      },
      TIMEOUT,
    )) as Response

    const json: PostKeysResponseBody = await response.json()

    if (response.ok) {
      return { kind: "success", revisionToken: json.revisionToken }
    } else {
      switch (json.error) {
        case EXISTING_KEYS_SENT_RESPONSE: {
          return {
            kind: "no-op",
            reason: PostKeysNoOpReason.NoTokenForExistingKeys,
            newKeysInserted: json.insertedExposures || 0,
            message: json.error,
          }
        }
        default: {
          return {
            kind: "failure",
            nature: PostKeysError.Unknown,
            message: json.error,
          }
        }
      }
    }
  } catch (e) {
    return {
      kind: "failure",
      nature:
        e.message === TIMEOUT_ERROR
          ? PostKeysError.Timeout
          : PostKeysError.RequestFailed,
      message: e.message,
    }
  }
}
