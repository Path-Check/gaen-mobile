import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react"

import { SymptomLogEntry, Symptom, sortSymptomEntries } from "./symptoms"
import {
  getLogEntries,
  createLogEntry,
  modifyLogEntry,
  deleteLogEntry as removeLogEntry,
  deleteAllSymptomLogs as deleteLogs,
  deleteSymptomLogsOlderThan,
} from "./nativeModule"
import {
  failureResponse,
  OperationResponse,
  SUCCESS_RESPONSE,
} from "../OperationResponse"

export type SymptomHistoryState = {
  symptomLogEntries: SymptomLogEntry[]
  addLogEntry: (symptoms: Symptom[]) => Promise<OperationResponse>
  updateLogEntry: (entry: SymptomLogEntry) => Promise<OperationResponse>
  deleteLogEntry: (symptomLogEntryId: string) => Promise<OperationResponse>
  deleteAllLogEntries: () => Promise<OperationResponse>
}

const initialState: SymptomHistoryState = {
  symptomLogEntries: [],
  addLogEntry: (_symptoms: Symptom[]) => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
  updateLogEntry: (_entry: SymptomLogEntry) => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
  deleteLogEntry: (_symptomLogEntryId: string) => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
  deleteAllLogEntries: () => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
}

export const SymptomHistoryContext = createContext<SymptomHistoryState>(
  initialState,
)

export const DAYS_AFTER_LOG_IS_CONSIDERED_STALE = 14

export const SymptomHistoryProvider: FunctionComponent = ({ children }) => {
  const [symptomLogEntries, setSymptomLogEntries] = useState<SymptomLogEntry[]>(
    [],
  )

  const fetchLogEntries = async () => {
    const entries = await getLogEntries()
    const sortedEntries = sortSymptomEntries(entries)
    setSymptomLogEntries(sortedEntries)
  }

  const cleanupStaleData = async () => {
    await deleteSymptomLogsOlderThan(DAYS_AFTER_LOG_IS_CONSIDERED_STALE)
  }

  useEffect(() => {
    cleanupStaleData()
    fetchLogEntries()
  }, [])

  const addLogEntry = async (symptoms: Symptom[]) => {
    try {
      const newEntry = {
        symptoms,
        date: Date.now(),
      }
      await createLogEntry(newEntry)
      await fetchLogEntries()
      return SUCCESS_RESPONSE
    } catch (e) {
      return failureResponse(e.message)
    }
  }

  const updateLogEntry = async (updatedLogEntry: SymptomLogEntry) => {
    try {
      await modifyLogEntry(updatedLogEntry)
      await fetchLogEntries()
      return SUCCESS_RESPONSE
    } catch (e) {
      return failureResponse(e.message)
    }
  }

  const deleteLogEntry = async (symptomLogEntryId: string) => {
    try {
      await removeLogEntry(symptomLogEntryId)
      await fetchLogEntries()
      return SUCCESS_RESPONSE
    } catch (e) {
      return failureResponse(e.message)
    }
  }

  const deleteAllLogEntries = async () => {
    try {
      await deleteLogs()
      await fetchLogEntries()
      return SUCCESS_RESPONSE
    } catch (e) {
      return failureResponse(e.message)
    }
  }

  return (
    <SymptomHistoryContext.Provider
      value={{
        symptomLogEntries,
        addLogEntry,
        updateLogEntry,
        deleteLogEntry,
        deleteAllLogEntries,
      }}
    >
      {children}
    </SymptomHistoryContext.Provider>
  )
}

export const useSymptomHistoryContext = (): SymptomHistoryState => {
  const symptomLogContext = useContext(SymptomHistoryContext)
  if (symptomLogContext === undefined) {
    throw new Error("SymptomHistoryContext must be used with a provider")
  }
  return symptomLogContext
}
