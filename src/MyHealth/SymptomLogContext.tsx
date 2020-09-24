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
} from "../gaen/nativeModule"
import { isToday } from "../utils/dateTime"

export type SymptomLogState = {
  dailyLogData: DayLogData[]
  addLogEntry: (symptoms: Symptom[]) => Promise<void>
  updateLogEntry: (entry: SymptomLogEntry) => Promise<void>
  todaysCheckIn: CheckIn
  addTodaysCheckIn: (status: CheckInStatus) => Promise<void>
}

const initialState = {
  dailyLogData: [],
  addLogEntry: (_symptoms: Symptom[]) => {
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
    const newEntry = {
      symptoms,
      date: Date.now(),
    }
    await createLogEntry(newEntry)
    await fetchLogEntries()
  }

  const updateLogEntry = async (updatedLogEntry: SymptomLogEntry) => {
    await modifyLogEntry(updatedLogEntry)
    await fetchLogEntries()
  }

  const addTodaysCheckIn = async (status: CheckInStatus) => {
    const newCheckIn = { date: Date.now(), status }
    await addCheckIn(newCheckIn)
    setTodaysCheckIn(newCheckIn)
    const newCheckIns = await getCheckIns()
    setCheckIns(newCheckIns)
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
