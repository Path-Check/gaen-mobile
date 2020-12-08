import { NativeModules } from "react-native"

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

export type PhoneNumberError = "Unknown"

export const submitPhoneNumber = async (
  phoneNumber: string,
): Promise<PhoneNumberResponse> => {
  try {
    escrowVerificationKeySubmissionModule.submitPhoneNumber(phoneNumber)
    return { kind: "success" }
  } catch (e) {
    switch (e.message) {
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
    escrowVerificationKeySubmissionModule.submitDiagnosisKeys(
      verificationCode,
      date,
    )
    return { kind: "success" }
  } catch (e) {
    switch (e.mssage) {
      default:
        return { kind: "failure", error: "Unknown" }
    }
  }
}
