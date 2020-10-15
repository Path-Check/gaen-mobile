import { NativeModules } from "react-native"

import { Symptom } from "./symptom"
import { SymptomHistory, toSymptomHistory, RawEntry } from "./symptomHistory"
import { Posix } from "../utils/dateTime"

// Symptom Log Entry Module
const symptomHistoryModule = NativeModules.SymptomLogEntryModule

export const createEntry = (
  date: Posix,
  symptoms: Set<Symptom>,
): Promise<void> => {
  const entry = { date, symptoms: Array.from(symptoms) }
  return symptomHistoryModule.addSymptomLogEntry(entry)
}

export const updateEntry = (
  date: Posix,
  symptoms: Set<Symptom>,
): Promise<void> => {
  const entry = { date, symptoms: Array.from(symptoms) }
  return symptomHistoryModule.updateSymptomLogEntry(entry)
}

export const deleteEntry = (symptomLogEntryId: string): Promise<void> => {
  return symptomHistoryModule.deleteSymptomLogEntry(symptomLogEntryId)
}

export const readEntries = async (): Promise<SymptomHistory> => {
  const rawEntries: RawEntry[] = await symptomHistoryModule.getSymptomLogEntries()
  const symptomHistory = toSymptomHistory(rawEntries)
  return symptomHistory
}

export const deleteAllEntries = async (): Promise<void> => {
  return symptomHistoryModule.deleteSymptomLogs()
}

export const deleteEntriesOlderThan = async (days: number): Promise<void> => {
  return symptomHistoryModule.deleteSymptomLogsOlderThan(days)
}
