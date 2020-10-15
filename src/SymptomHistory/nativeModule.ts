import { NativeModules } from "react-native"

import { Symptom } from "./symptom"
import { RawEntry } from "./symptomHistory"
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

type UUID = string

export const updateEntry = (
  id: UUID,
  date: Posix,
  symptoms: Set<Symptom>,
): Promise<void> => {
  const entry = { id, date, symptoms: Array.from(symptoms) }
  return symptomHistoryModule.updateSymptomLogEntry(entry)
}

export const deleteEntry = (symptomLogEntryId: string): Promise<void> => {
  return symptomHistoryModule.deleteSymptomLogEntry(symptomLogEntryId)
}

export const readEntries = async (): Promise<RawEntry[]> => {
  const rawEntries: RawEntry[] = await symptomHistoryModule.getSymptomLogEntries()
  return rawEntries
}

export const deleteAllEntries = async (): Promise<void> => {
  return symptomHistoryModule.deleteSymptomLogs()
}

export const deleteEntriesOlderThan = async (days: number): Promise<void> => {
  return symptomHistoryModule.deleteSymptomLogsOlderThan(days)
}
