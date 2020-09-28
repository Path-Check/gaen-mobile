import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  SymptomLogEntry,
  CheckIn,
  CheckInStatus,
  DayLogData,
  combineSymptomAndCheckInLogs,
  Symptom,
} from "./symptoms"
import {
  getLogEntries,
  getCheckIns,
  addCheckIn,
  createLogEntry,
  modifyLogEntry,
  deleteLogEntry as removeLogEntry,
  deleteAllCheckIns as deleteCheckIns,
  deleteAllSymptomLogs as deleteLogs,
} from "../gaen/nativeModule"
import { isToday } from "../utils/dateTime"
import {
  failureResponse,
  OperationResponse,
  SUCCESS_RESPONSE,
} from "../OperationResponse"

export type SymptomLogState = {
  dailyLogData: DayLogData[]
  addLogEntry: (symptoms: Symptom[]) => Promise<OperationResponse>
  updateLogEntry: (entry: SymptomLogEntry) => Promise<OperationResponse>
  deleteLogEntry: (symptomLogEntryId: string) => Promise<OperationResponse>
  todaysCheckIn: CheckIn
  addTodaysCheckIn: (status: CheckInStatus) => Promise<OperationResponse>
  deleteAllCheckIns: () => Promise<OperationResponse>
  deleteAllLogEntries: () => Promise<OperationResponse>
}

const initialState: SymptomLogState = {
  dailyLogData: [],
  addLogEntry: (_symptoms: Symptom[]) => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
  updateLogEntry: (_entry: SymptomLogEntry) => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
  deleteLogEntry: (_symptomLogEntryId: string) => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
  todaysCheckIn: { date: Date.now(), status: CheckInStatus.NotCheckedIn },
  addTodaysCheckIn: (_status: CheckInStatus) => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
  deleteAllCheckIns: () => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
  deleteAllLogEntries: () => {
    return Promise.resolve(SUCCESS_RESPONSE)
  },
}

export const SymptomLogContext = createContext<SymptomLogState>(initialState)

export const SymptomLogProvider: FunctionComponent = ({ children }) => {
  const [dailyLogData, setDailyLogData] = useState<DayLogData[]>([])
  const [logEntries, setLogEntries] = useState<SymptomLogEntry[]>([])
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [todaysCheckIn, setTodaysCheckIn] = useState<CheckIn>(
    initialState.todaysCheckIn,
  )

  const detectTodaysCheckIn = (rawCheckIns: CheckIn[]) => {
    const checkInAddedToday = rawCheckIns.find(({ date }) => {
      return isToday(date)
    })
    checkInAddedToday && setTodaysCheckIn(checkInAddedToday)
  }

  const fetchLogEntries = async () => {
    const entries = await getLogEntries()
    setLogEntries(entries)
  }

  useEffect(() => {
    fetchLogEntries()
    getCheckIns().then((checkIns) => {
      setCheckIns(checkIns)
      detectTodaysCheckIn(checkIns)
    })
  }, [])

  useEffect(() => {
    setDailyLogData(combineSymptomAndCheckInLogs(logEntries, checkIns))
  }, [checkIns, logEntries])

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

  const addTodaysCheckIn = async (status: CheckInStatus) => {
    try {
      const newCheckIn = { date: Date.now(), status }
      await addCheckIn(newCheckIn)
      setTodaysCheckIn(newCheckIn)
      const newCheckIns = await getCheckIns()
      setCheckIns(newCheckIns)
      return SUCCESS_RESPONSE
    } catch (e) {
      return failureResponse(e.message)
    }
  }

  const deleteAllCheckIns = async () => {
    try {
      await deleteCheckIns()
      await getCheckIns()
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
        addTodaysCheckIn,
        todaysCheckIn,
        dailyLogData,
        addLogEntry,
        updateLogEntry,
        deleteLogEntry,
        deleteAllCheckIns,
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
