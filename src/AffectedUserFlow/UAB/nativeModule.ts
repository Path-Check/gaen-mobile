import { NativeModules } from "react-native"

import { Posix } from "../../exposure"

// Key Submission Module
const uabKeySubmissionModule = NativeModules.UABKeySubmissionModule

export const submitPhoneNumber = async (phoneNumber: string): Promise<void> => {
  return uabKeySubmissionModule.submitPhoneNumber(phoneNumber)
}

export const submitDiagnosisKeys = async (
  verificationCode: string,
  date: Posix,
): Promise<void> => {
  return uabKeySubmissionModule.submitDiagnosisKeys(verificationCode, date)
}
