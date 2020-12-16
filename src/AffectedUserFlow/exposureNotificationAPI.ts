import "react-native"
import env from "react-native-config"

import { ExposureKey } from "../exposureKey"
import { fetchWithTimeout, TIMEOUT_ERROR } from "./fetchWithTimeout"
import Logger from "../logger"

const exposureUrl = env.POST_DIAGNOSIS_KEYS_URL

const defaultHeaders = {
  "content-type": "application/json",
  accept: "application/json",
}

type Token = string

interface PostKeysResponseBody {
  error: string
  insertedExposures: number
  padding: string
  revisionToken: Token
}

export enum PostKeysError {
  Unknown = "Unknown",
  InternalServerError = "InternalServerError",
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
  EmptyExposureKeys = "EmptyExposureKeys",
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

type Posix = number

type PostDiagnosisKeysRequestData = {
  temporaryExposureKeys: ExposureKey[]
  regions: RegionCode[]
  verificationPayload: Token
  hmackey: string
  padding: string
  appPackageName: string
  revisionToken: string
  symptomOnsetInterval?: Posix
}

class PostDiagnosisKeysRequest {
  private requestData: PostDiagnosisKeysRequestData
  private retriesMade = 1

  private static MAX_RETRIES = 3
  private static RETRY_STATUS_CODES = [429, 503]
  private static INTERNAL_ERROR = "internal_error"
  private static EMPTY_EXPOSURE_KEYS =
    "unable to validate diagnosis verification: calculating expected HMAC: cannot calculate hmac on empty exposure keys"
  private static EXISTING_KEYS_SENT_RESPONSE =
    "no revision token, but sent existing keys"
  private static TIMEOUT = 5000
  private static DEFAULT_RETRY_DELAY_MS = 1000

  static perform = (data: PostDiagnosisKeysRequestData) => {
    return new PostDiagnosisKeysRequest(data).postKeys()
  }

  private constructor(requestData: PostDiagnosisKeysRequestData) {
    this.requestData = requestData
  }

  private postKeys = async () => {
    try {
      const response = (await fetchWithTimeout(
        exposureUrl,
        {
          method: "POST",
          headers: defaultHeaders,
          body: this.requestBody(),
        },
        PostDiagnosisKeysRequest.TIMEOUT,
      )) as Response

      return await this.handlePostDiagnosisKeysResponse(response)
    } catch (e) {
      return {
        kind: "failure" as const,
        nature:
          e.message === TIMEOUT_ERROR
            ? PostKeysError.Timeout
            : PostKeysError.RequestFailed,
        message: e.message,
      }
    }
  }

  private handlePostDiagnosisKeysResponse = async (
    response: Response,
  ): Promise<PostKeysResponse | PostKeysFailure> => {
    const responseJsonBody: PostKeysResponseBody = await response.json()

    if (response.ok) {
      return {
        kind: "success" as const,
        revisionToken: responseJsonBody.revisionToken,
      }
    } else if (
      this.requestShouldBeRetried(response.status, responseJsonBody.error)
    ) {
      await this.delayRetry()
      this.retriesMade += 1
      return this.postKeys()
    }
    return this.handlePostDiagnosisKeysFailure(responseJsonBody)
  }

  private handlePostDiagnosisKeysFailure = ({
    error,
    insertedExposures,
  }: PostKeysResponseBody): PostKeysNoOp | PostKeysFailure => {
    switch (error) {
      case PostDiagnosisKeysRequest.EXISTING_KEYS_SENT_RESPONSE: {
        return {
          kind: "no-op" as const,
          reason: PostKeysNoOpReason.NoTokenForExistingKeys,
          newKeysInserted: insertedExposures || 0,
          message: error,
        }
      }
      case PostDiagnosisKeysRequest.EMPTY_EXPOSURE_KEYS: {
        return {
          kind: "no-op" as const,
          reason: PostKeysNoOpReason.EmptyExposureKeys,
          newKeysInserted: 0,
          message: error,
        }
      }
      case PostDiagnosisKeysRequest.INTERNAL_ERROR: {
        return {
          kind: "failure" as const,
          nature: PostKeysError.InternalServerError,
          message: error,
        }
      }
      default: {
        Logger.error("Unhandled Post DiagnosisKeys Error", { error })
        return {
          kind: "failure" as const,
          nature: PostKeysError.Unknown,
          message: error,
        }
      }
    }
  }

  private requestShouldBeRetried = (statusCode: number, error: string) => {
    return (
      this.retriesMade < PostDiagnosisKeysRequest.MAX_RETRIES &&
      (PostDiagnosisKeysRequest.RETRY_STATUS_CODES.includes(statusCode) ||
        error === PostDiagnosisKeysRequest.INTERNAL_ERROR)
    )
  }

  private delayRetry = async () => {
    return new Promise((resolve) =>
      setTimeout(resolve, PostDiagnosisKeysRequest.DEFAULT_RETRY_DELAY_MS),
    )
  }

  private requestBody = () => {
    const encodedBody = JSON.stringify(this.requestData)
    Logger.addMetadata("publishKeys", { requestBody: encodedBody })
    return encodedBody
  }
}

export const postDiagnosisKeys = async (
  exposureKeys: ExposureKey[],
  regionCodes: RegionCode[],
  certificate: Token,
  hmacKey: string,
  appPackageName: string,
  revisionToken: string,
  symptomOnsetDate: Posix | null,
): Promise<PostKeysResponse | PostKeysFailure> => {
  const toInterval = (posix: Posix): number => {
    const minutesSinceEpoch = posix / 60000
    const interval = Math.floor(minutesSinceEpoch / 10)
    return interval
  }

  const baseData = {
    temporaryExposureKeys: exposureKeys,
    regions: regionCodes,
    appPackageName,
    verificationPayload: certificate,
    hmackey: hmacKey,
    padding: DEFAULT_PADDING,
    revisionToken,
  }

  const data = symptomOnsetDate
    ? {
        ...baseData,
        symptomOnsetInterval: toInterval(symptomOnsetDate),
      }
    : baseData

  return await PostDiagnosisKeysRequest.perform(data)
}
