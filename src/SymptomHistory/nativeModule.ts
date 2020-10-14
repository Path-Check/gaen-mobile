import { NativeModules } from "react-native"

import {
  SymptomEntry,
  SymptomEntryAttributes,
} from "../SymptomHistory/symptoms"

// Symptom Log Entry Module
const symptomHistoryModule = NativeModules.SymptomLogEntryModule

export const createEntry = (entry: SymptomEntryAttributes): Promise<void> => {
  return symptomHistoryModule.addSymptomLogEntry(entry)
}

export const updateEntry = (entry: SymptomEntry): Promise<void> => {
  return symptomHistoryModule.updateSymptomLogEntry(entry)
}

export const deleteEntry = (symptomLogEntryId: string): Promise<void> => {
  return symptomHistoryModule.deleteSymptomLogEntry(symptomLogEntryId)
}

export const readEntries = (): Promise<SymptomEntry[]> => {
  return symptomHistoryModule.getSymptomLogEntries()
}

export const deleteAllEntries = async (): Promise<void> => {
  return symptomHistoryModule.deleteSymptomLogs()
}

export const deleteEntriesOlderThan = async (days: number): Promise<void> => {
  return symptomHistoryModule.deleteSymptomLogsOlderThan(days)
}

