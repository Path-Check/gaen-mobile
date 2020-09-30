import { NativeModules } from "react-native"

import {
  CheckIn,
  SymptomLogEntry,
  SymptomLogEntryAttributes,
} from "../MyHealth/symptoms"

// Check In Module
const checkInModule = NativeModules.CheckInModule

export const getCheckIns = async (): Promise<CheckIn[]> => {
  return checkInModule.getCheckIns()
}

export const addCheckIn = (checkIn: CheckIn): Promise<void> => {
  return checkInModule.addCheckIn(checkIn)
}

export const deleteAllCheckIns = async (): Promise<"success"> => {
  return checkInModule.deleteCheckins()
}

export const deleteStaleCheckIns = async (): Promise<"success"> => {
  return checkInModule.deleteStaleCheckIns()
}

// Symptom Log Entry Module
const symptomLogEntryModule = NativeModules.SymptomLogEntryModule

export const createLogEntry = (
  entry: SymptomLogEntryAttributes,
): Promise<void> => {
  return symptomLogEntryModule.addSymptomLogEntry(entry)
}

export const modifyLogEntry = (entry: SymptomLogEntry): Promise<void> => {
  return symptomLogEntryModule.updateSymptomLogEntry(entry)
}

export const deleteLogEntry = (symptomLogEntryId: string): Promise<void> => {
  return symptomLogEntryModule.deleteSymptomLogEntry(symptomLogEntryId)
}

export const getLogEntries = (): Promise<SymptomLogEntry[]> => {
  return symptomLogEntryModule.getSymptomLogEntries()
}

export const deleteAllSymptomLogs = async (): Promise<void> => {
  return symptomLogEntryModule.deleteSymptomLogs()
}

export const deleteStaleSymptomLogs = async (): Promise<void> => {
  return symptomLogEntryModule.deleteStaleSymptomLogs()
}
