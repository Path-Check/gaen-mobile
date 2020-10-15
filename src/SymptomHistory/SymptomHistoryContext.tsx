import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react"

import { SymptomEntry, SymptomHistory } from "./symptomHistory"
import { Symptom } from "./symptom"
import * as NativeModule from "./nativeModule"
import { Posix, isSameDay } from "../utils/dateTime"
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
  ) => Promise<OperationResponse>
  deleteAllEntries: () => Promise<OperationResponse>
}

const initialState: SymptomHistoryState = {
  symptomHistory: [],
  updateEntry: (_date: Posix, _symptoms: Set<Symptom>) => {
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

  const updateEntry = async (date: Posix, symptoms: Set<Symptom>) => {
    const entryToUpdate = symptomHistory.find((el: SymptomEntry) => {
      return isSameDay(el.date, date) && el.kind === "Symptoms"
    })

    try {
      if (entryToUpdate?.kind === "Symptoms") {
        await NativeModule.updateEntry(entryToUpdate.id, date, symptoms)
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
