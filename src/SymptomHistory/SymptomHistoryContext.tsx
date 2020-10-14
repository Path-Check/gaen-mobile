import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  SymptomEntry,
  SymptomHistory,
  Symptom,
  SymptomEntryAttributes,
} from "./symptoms"
import * as NativeModule from "./nativeModule"

import {
  failureResponse,
  OperationResponse,
  SUCCESS_RESPONSE,
} from "../OperationResponse"

export type SymptomHistoryState = {
  symptomHistory: SymptomHistory
  createEntry: (symptoms: Symptom[]) => Promise<OperationResponse>
  updateEntry: (entry: SymptomEntry) => Promise<OperationResponse>
  deleteEntry: (symptomEntryId: string) => Promise<OperationResponse>
  deleteAllEntries: () => Promise<OperationResponse>
}

const initialState: SymptomHistoryState = {
  symptomHistory: [],
  createEntry: (_symptoms: Symptom[]) => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
  updateEntry: (_entry: SymptomEntry) => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
  deleteEntry: (_symptomEntryId: string) => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
  deleteAllEntries: () => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
}

export const SymptomHistoryContext = createContext<SymptomHistoryState>(
  initialState,
)

export const DAYS_AFTER_LOG_IS_CONSIDERED_STALE = 14

export const SymptomHistoryProvider: FunctionComponent = ({ children }) => {
  const [symptomHistory, setSymptomHistory] = useState<SymptomHistory>([])

  const fetchEntries = async () => {
    const history = await NativeModule.readEntries()
    setSymptomHistory(history)
  }

  const cleanupStaleData = async () => {
    await NativeModule.deleteEntriesOlderThan(
      DAYS_AFTER_LOG_IS_CONSIDERED_STALE,
    )
  }

  useEffect(() => {
    cleanupStaleData()
    fetchEntries()
  }, [])

  const createEntry = async (symptoms: Symptom[]) => {
    try {
      const newEntry: SymptomEntryAttributes = {
        symptoms: new Set(symptoms),
        date: Date.now(),
      }
      await NativeModule.createEntry(newEntry)
      await fetchEntries()
      return SUCCESS_RESPONSE
    } catch (e) {
      return failureResponse(e.message)
    }
  }

  const updateEntry = async (entry: SymptomEntry) => {
    try {
      await NativeModule.updateEntry(entry)
      await fetchEntries()
      return SUCCESS_RESPONSE
    } catch (e) {
      return failureResponse(e.message)
    }
  }

  const deleteEntry = async (symptomEntryId: string) => {
    try {
      await NativeModule.deleteEntry(symptomEntryId)
      await fetchEntries()
      return SUCCESS_RESPONSE
    } catch (e) {
      return failureResponse(e.message)
    }
  }

  const deleteAllEntries = async () => {
    try {
      await NativeModule.deleteAllEntries()
      await fetchEntries()
      return SUCCESS_RESPONSE
    } catch (e) {
      return failureResponse(e.message)
    }
  }

  return (
    <SymptomHistoryContext.Provider
      value={{
        symptomHistory,
        createEntry,
        updateEntry,
        deleteEntry,
        deleteAllEntries,
      }}
    >
      {children}
    </SymptomHistoryContext.Provider>
  )
}

export const useSymptomHistoryContext = (): SymptomHistoryState => {
  const symptomHistoryContext = useContext(SymptomHistoryContext)
  if (symptomHistoryContext === undefined) {
    throw new Error("SymptomHistoryContext must be used with a provider")
  }
  return symptomHistoryContext
}
