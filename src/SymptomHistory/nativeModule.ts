import { NativeModules } from "react-native"

import {
  SymptomLogEntry,
  SymptomLogEntryAttributes,
} from "../SymptomHistory/symptoms"

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

export const deleteSymptomLogsOlderThan = async (
  days: number,
): Promise<void> => {
  return symptomLogEntryModule.deleteSymptomLogsOlderThan(days)
}
