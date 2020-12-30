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

export type PhoneNumberError = "RateLimit" | "Unknown"

export const submitPhoneNumber = async (
  phoneNumber: string,
): Promise<PhoneNumberResponse> => {
  try {
    await escrowVerificationKeySubmissionModule.submitPhoneNumber(phoneNumber)
    return { kind: "success" }
  } catch (e) {
    Logger.error(`failed to submit phone number: `, e)
    switch (e.code) {
      case "403":
        return { kind: "failure", error: "RateLimit" }
      default:
        return { kind: "failure", error: "Unknown" }
    }
  }
}

export type SubmitKeysResponse = SubmitKeysSuccess | SubmitKeysFailure

interface SubmitKeysSuccess {
  kind: "success"
}
interface SubmitKeysFailure {
  kind: "failure"
  error: SubmitKeysError
}

export type SubmitKeysError = "Unknown"

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
    Logger.error(`failed to submit verification code: `, e)
    switch (e.mssage) {
      default:
        return { kind: "failure", error: "Unknown" }
    }
  }
}
