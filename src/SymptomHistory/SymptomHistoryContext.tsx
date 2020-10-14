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
  sortSymptomEntries,
} from "./symptoms"
import * as NativeModule from "./nativeModule"

import {
  failureResponse,
  OperationResponse,
  SUCCESS_RESPONSE,
} from "../OperationResponse"

export type SymptomHistoryState = {
  symptomEntries: SymptomHistory
  createEntry: (symptoms: Symptom[]) => Promise<OperationResponse>
  updateEntry: (entry: SymptomEntry) => Promise<OperationResponse>
  deleteEntry: (symptomEntryId: string) => Promise<OperationResponse>
  deleteAllEntries: () => Promise<OperationResponse>
}

const initialState: SymptomHistoryState = {
  symptomEntries: [],
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
  const [symptomEntries, setSymptomEntries] = useState<SymptomHistory>([])

  const fetchEntries = async () => {
    const entries = await NativeModule.readEntries()
    const sortedEntries = sortSymptomEntries(entries)
    setSymptomEntries(sortedEntries)
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
      const newEntry = {
        symptoms,
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
        symptomEntries,
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
