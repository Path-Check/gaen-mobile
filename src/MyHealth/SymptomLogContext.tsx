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

export type SymptomLogState = {
  symptomLogEntries: SymptomLogEntry[]
  addLogEntry: (symptoms: Symptom[]) => Promise<OperationResponse>
  updateLogEntry: (entry: SymptomLogEntry) => Promise<OperationResponse>
  deleteLogEntry: (symptomLogEntryId: string) => Promise<OperationResponse>
  deleteAllLogEntries: () => Promise<OperationResponse>
}

const initialState: SymptomLogState = {
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

export const SymptomLogContext = createContext<SymptomLogState>(initialState)

export const DAYS_AFTER_LOG_IS_CONSIDERED_STALE = 14

export const SymptomLogProvider: FunctionComponent = ({ children }) => {
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
    <SymptomLogContext.Provider
      value={{
        symptomLogEntries,
        addLogEntry,
        updateLogEntry,
        deleteLogEntry,
        deleteAllLogEntries,
      }}
    >
      {children}
    </SymptomLogContext.Provider>
  )
}

export const useSymptomLogContext = (): SymptomLogState => {
  const symptomLogContext = useContext(SymptomLogContext)
  if (symptomLogContext === undefined) {
    throw new Error("SymptomLogContext must be used with a provider")
  }
  return symptomLogContext
}
