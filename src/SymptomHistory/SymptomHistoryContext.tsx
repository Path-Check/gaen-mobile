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
import { Posix } from "../utils/dateTime"
import {
  failureResponse,
  OperationResponse,
  SUCCESS_RESPONSE,
} from "../OperationResponse"

export type SymptomHistoryState = {
  symptomHistory: SymptomHistory
  updateEntry: (
    date: Posix,
    symptoms: Set<Symptom>,
    oldEntry: SymptomEntry,
  ) => Promise<OperationResponse>
  deleteAllEntries: () => Promise<OperationResponse>
}
const initialState: SymptomHistoryState = {
  symptomHistory: [],
  updateEntry: (
    _date: Posix,
    _symptoms: Set<Symptom>,
    _oldEntry: SymptomEntry,
  ) => {
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
    date: Posix,
    symptoms: Set<Symptom>,
    oldEntry: SymptomEntry,
  ) => {
    try {
      if (oldEntry?.kind === "Symptoms") {
        await NativeModule.updateEntry(oldEntry.id, date, symptoms)
        await fetchEntries()
        return SUCCESS_RESPONSE
      } else {
        await NativeModule.createEntry(date, symptoms)
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
