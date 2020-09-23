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
} from "./symptoms"
import { getLogEntries, getCheckIns, addCheckIn } from "../gaen/nativeModule"
import { isToday } from "../utils/dateTime"

export type SymptomLogState = {
  dailyLogData: DayLogData[]
  addLogEntry: (entry: SymptomLogEntry) => Promise<void>
  updateLogEntry: (entry: SymptomLogEntry) => Promise<void>
  todaysCheckIn: CheckIn
  addTodaysCheckIn: (status: CheckInStatus) => Promise<void>
}

const initialState = {
  dailyLogData: [],
  addLogEntry: (_entry: SymptomLogEntry) => {
    return Promise.resolve()
  },
  updateLogEntry: (_entry: SymptomLogEntry) => {
    return Promise.resolve()
  },
  todaysCheckIn: { date: Date.now(), status: CheckInStatus.NotCheckedIn },
  addTodaysCheckIn: (_status: CheckInStatus) => {
    return Promise.resolve()
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

  useEffect(() => {
    getLogEntries().then((entries) => {
      setLogEntries(entries)
    })
    getCheckIns().then((checkIns) => {
      setCheckIns(checkIns)
      detectTodaysCheckIn(checkIns)
    })
  }, [])

  useEffect(() => {
    setDailyLogData(combineSymptomAndCheckInLogs(logEntries, checkIns))
  }, [checkIns, logEntries])

  const addLogEntry = async (newEntry: SymptomLogEntry) => {
    const newLogEntries = [...logEntries, newEntry]
    setLogEntries(newLogEntries)
  }

  const updateLogEntry = async (updatedLogEntry: SymptomLogEntry) => {
    const entriesWithoutTheUpdatedLog = logEntries.filter((entry) => {
      return entry.id !== updatedLogEntry.id
    })
    setLogEntries([...entriesWithoutTheUpdatedLog, updatedLogEntry])
  }

  const addTodaysCheckIn = async (status: CheckInStatus) => {
    const newCheckIn = { date: Date.now(), status }
    await addCheckIn(newCheckIn)
    setTodaysCheckIn(newCheckIn)
    getCheckIns().then((checkIns) => {
      setCheckIns(checkIns)
    })
  }

  return (
    <SymptomLogContext.Provider
      value={{
        addTodaysCheckIn,
        todaysCheckIn,
        dailyLogData,
        addLogEntry,
        updateLogEntry,
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
