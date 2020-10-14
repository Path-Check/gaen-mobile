import { NativeModules } from "react-native"

import {
  SymptomEntry,
  SymptomHistory,
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

type RawEntry = {
  id: string
  date: number
  symptoms: string[]
}

const toSymptomHistory = (rawEntries: RawEntry[]): SymptomHistory => {
  return [
    { id: "a", kind: "NoData", date: 1234, symptoms: [] },
    { id: "b", kind: "Symptoms", date: 1234, symptoms: ["cough"] },
    { id: "c", kind: "NoSymptoms", date: 1234, symptoms: [] },
  ]
}

export const readEntries = (): Promise<SymptomEntry[]> => {
  const rawEntries: RawEntry[] = symptomHistoryModule.getSymptomLogEntries()

  const symptomHistory = toSymptomHistory(rawEntries)
  return
}

export const deleteAllEntries = async (): Promise<void> => {
  return symptomHistoryModule.deleteSymptomLogs()
}

export const deleteEntriesOlderThan = async (days: number): Promise<void> => {
  return symptomHistoryModule.deleteSymptomLogsOlderThan(days)
}

