import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  toSymptomHistory,
  SymptomEntry,
  SymptomHistory,
} from "./symptomHistory"
import { Symptom } from "./symptom"
import * as NativeModule from "./nativeModule"
import {
  failureResponse,
  OperationResponse,
  SUCCESS_RESPONSE,
} from "../OperationResponse"

export type SymptomHistoryState = {
  symptomHistory: SymptomHistory
  updateEntry: (
    entry: SymptomEntry,
    newSymptoms: Set<Symptom>,
  ) => Promise<OperationResponse>
  deleteAllEntries: () => Promise<OperationResponse>
}
const initialState: SymptomHistoryState = {
  symptomHistory: [],
  updateEntry: (_entry: SymptomEntry, _newUserInput: Set<Symptom>) => {
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
    const rawEntries = await NativeModule.readEntries()
    const history = toSymptomHistory(Date.now(), rawEntries)
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

  const updateEntry = async (
    entry: SymptomEntry,
    newSymptoms: Set<Symptom>,
  ) => {
    try {
      if (entry.kind === "UserInput") {
        await NativeModule.updateEntry(entry.id, entry.date, newSymptoms)
        await fetchEntries()
        return SUCCESS_RESPONSE
      } else {
        await NativeModule.createEntry(entry.date, newSymptoms)
        await fetchEntries()
        return SUCCESS_RESPONSE
      }
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
        updateEntry,
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
