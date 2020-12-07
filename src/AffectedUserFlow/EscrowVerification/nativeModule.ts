import { NativeModules } from "react-native"

import { Posix } from "../../exposure"

// Key Submission Module
const escrowVerificationKeySubmissionModule =
  NativeModules.EscrowVerificationKeySubmissionModule

export const submitPhoneNumber = async (phoneNumber: string): Promise<void> => {
  return escrowVerificationKeySubmissionModule.submitPhoneNumber(phoneNumber)
}

export const submitDiagnosisKeys = async (
  verificationCode: string,
  date: Posix,
): Promise<void> => {
  return escrowVerificationKeySubmissionModule.submitDiagnosisKeys(
    verificationCode,
    date,
  )
}
