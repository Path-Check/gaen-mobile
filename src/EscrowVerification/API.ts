import { NativeModules } from "react-native"

import Logger from "../logger"

type Posix = number

// Key Submission Module
const escrowVerificationKeySubmissionModule =
  NativeModules.EscrowVerificationKeySubmissionModule

type PhoneNumberResponse = PhoneNumberSuccess | PhoneNumberFailure

interface PhoneNumberSuccess {
  kind: "success"
}
interface PhoneNumberFailure {
  kind: "failure"
  error: PhoneNumberError
}

export type PhoneNumberError =
  | "NoKeysOnDevice"
  | "NotAuthorized"
  | "Forbidden"
  | "RateLimit"
  | "Unknown"

export const submitPhoneNumber = async (
  phoneNumber: string,
): Promise<PhoneNumberResponse> => {
  try {
    await escrowVerificationKeySubmissionModule.submitPhoneNumber(phoneNumber)
    return { kind: "success" }
  } catch (e) {
    Logger.addMetadata(`failed to submit phone number: `, {
      error: JSON.stringify(e),
    })
    if (e.code === "ENErrorDomain") {
      return { kind: "failure", error: handlePhoneENError(e) }
    } else {
      return { kind: "failure", error: handlePhoneNetworkError(e) }
    }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const handlePhoneENError = (error: any): PhoneNumberError => {
  try {
    const errorMessage = error.message
    assertString(errorMessage)

    const errorCodeRegex = /ENErrorDomain error (\d+)./
    const match = errorMessage.match(errorCodeRegex) ?? []
    const errorCode = match[1]
    assertIntegerString(errorCode)

    switch (errorCode) {
      case "4":
        return "NotAuthorized"
      default:
        Logger.error(`Unhandled error code in handlePhoneENError:`, {
          code: errorCode,
        })
        return "Unknown"
    }
  } catch (e) {
    Logger.error(`Unknown error format for handlePhoneENError:`, {
      error: JSON.stringify(error),
      message: e,
    })
    return "Unknown"
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
const handlePhoneNetworkError = (error: any): PhoneNumberError => {
  try {
    assertIntegerString(error.code)

    switch (error.code) {
      case "403":
        Logger.error("Escrow server returned 403: Forbidden")
        return "Forbidden"
      case "429":
        Logger.error("Escrow server returned 429: Hit rate limit")
        return "RateLimit"
      case "999":
        return "NoKeysOnDevice"
      default:
        Logger.error(`Unhandled error code in handlePhoneNetworkError:`, {
          code: error.code,
        })
        return "Unknown"
    }
  } catch (e) {
    Logger.error(`Unknown error format for handlePhoneNetworkError:`, {
      error: JSON.stringify(error),
      message: e,
    })
    return "Unknown"
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export type SubmitKeysResponse = SubmitKeysSuccess | SubmitKeysFailure

interface SubmitKeysSuccess {
  kind: "success"
}
interface SubmitKeysFailure {
  kind: "failure"
  error: SubmitKeysError
}

export type SubmitKeysError =
  | "NoKeysOnDevice"
  | "NotAuthorized"
  | "RateLimit"
  | "Forbidden"
  | "Unknown"

export const submitDiagnosisKeys = async (
  verificationCode: string,
  date: Posix,
): Promise<SubmitKeysResponse> => {
  try {
    await escrowVerificationKeySubmissionModule.submitDiagnosisKeys(
      verificationCode,
      date,
    )
    return { kind: "success" }
  } catch (e) {
    Logger.addMetadata(`failed to submit diagnosis keys: `, {
      error: JSON.stringify(e),
    })

    if (e.code === "ENErrorDomain") {
      return { kind: "failure", error: handleKeysENError(e) }
    } else {
      return { kind: "failure", error: handleKeysNetworkError(e) }
    }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const handleKeysENError = (error: any): SubmitKeysError => {
  try {
    const errorMessage = error.message
    assertString(errorMessage)

    const errorCodeRegex = /ENErrorDomain error (\d+)./
    const match = errorMessage.match(errorCodeRegex) ?? []
    const errorCode = match[1]
    assertIntegerString(errorCode)

    switch (errorCode) {
      case "4":
        return "NotAuthorized"
      default:
        Logger.error(`Unhandled error code in handleKeysENError:`, {
          code: errorCode,
        })
        return "Unknown"
    }
  } catch (e) {
    Logger.error(`Unknown error format for handleKeysENError:`, {
      error: JSON.stringify(error),
      message: e,
    })
    return "Unknown"
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
const handleKeysNetworkError = (error: any): SubmitKeysError => {
  try {
    assertIntegerString(error.code)

    switch (error.code) {
      case "999":
        return "NoKeysOnDevice"
      case "403":
        Logger.error("Escrow server returned 403: Forbidden")
        return "Forbidden"
      case "429":
        Logger.error("Escrow server returned 429: Hit rate limit")
        return "RateLimit"
      default:
        Logger.error(`Unhandled error code in handleKeysNetworkError:`, {
          code: error.code,
        })
        return "Unknown"
    }
  } catch (e) {
    Logger.error(`Unknown error format for handleKeysNetworkError:`, {
      error: JSON.stringify(error),
      message: e,
    })
    return "Unknown"
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function assertString(s: unknown): asserts s is string {
  if (typeof s !== "string") {
    throw new Error("Value was not a string: " + s)
  }
}

function assertIntegerString(integer: unknown): asserts integer is string {
  if (!integer || !Number.isInteger(Number(integer))) {
    throw new Error("Value was not an String Integer: " + integer)
  }
}
