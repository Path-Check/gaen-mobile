import env from "react-native-config"

import { ExposureKey } from "../exposureKey"

const exposureUrl = env.POST_DIAGNOSIS_KEYS_URL

const defaultHeaders = {
  "content-type": "application/json",
  accept: "application/json",
}

type Token = string

interface NetworkSuccess<T> {
  kind: "success"
  body: T
}
interface NetworkFailure<U> {
  kind: "failure"
  error: U
  message?: string
}

export type NetworkResponse<T, U = "Unknown"> =
  | NetworkSuccess<T>
  | NetworkFailure<U>

type PostKeysSuccess = {
  revisionToken: Token
}

export type PostKeysError = "Unknown"

type RegionCode = string

const DEFAULT_PADDING = ""

export const postDiagnosisKeys = async (
  exposureKeys: ExposureKey[],
  regionCodes: RegionCode[],
  certificate: Token,
  hmacKey: string,
  appPackageName: string,
  revisionToken: string,
): Promise<NetworkResponse<PostKeysSuccess, PostKeysError>> => {
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

    const json = await response.json()
    if (response.ok) {
      return { kind: "success", body: json }
    } else {
      switch (json.error) {
        default: {
          return { kind: "failure", error: "Unknown", message: json.error }
        }
      }
    }
  } catch (e) {
    return { kind: "failure", error: "Unknown" }
  }
}
