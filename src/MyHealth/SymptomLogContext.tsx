import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  SymptomLogEntry,
  DailyCheckIn,
  CheckInStatus,
  DayLogData,
  serializeDailyLogData,
} from "./symptoms"

const fetchLogEntries = (): Promise<SymptomLogEntry[]> => {
  return Promise.resolve([
    {
      id: "1",
      symptoms: ["Loss of Breath"],
      date: 1600614626042,
    },
    {
      id: "2",
      symptoms: ["Cough", "Fever"],
      date: 1600610400000,
    },
    {
      id: "3",
      symptoms: ["Fever"],
      date: 1599919200000,
    },
  ])
}

const fetchDailyCheckIns = (): Promise<DailyCheckIn[]> => {
  return Promise.resolve([
    {
      date: 1600804626042,
      status: CheckInStatus.FeelingGood,
    },
    {
      date: 1599919200000,
      status: CheckInStatus.FeelingNotWell,
    },
  ])
}

export type SymptomLogState = {
  dailyLogData: DayLogData[]
  addLogEntry: (entry: SymptomLogEntry) => Promise<void>
  updateLogEntry: (entry: SymptomLogEntry) => Promise<void>
  deleteLogEntry: (entry: SymptomLogEntry) => Promise<void>
}

const initialState = {
  dailyLogData: [],
  addLogEntry: (_entry: SymptomLogEntry) => {
    return Promise.resolve()
  },
  updateLogEntry: (_entry: SymptomLogEntry) => {
    return Promise.resolve()
  },
  deleteLogEntry: (_entry: SymptomLogEntry) => {
    return Promise.resolve()
  },
}

export const SymptomLogContext = createContext<SymptomLogState>(initialState)

export const SymptomLogProvider: FunctionComponent = ({ children }) => {
  const [dailyLogData, setDailyLogData] = useState<DayLogData[]>([])
  const [logEntries, setLogEntries] = useState<SymptomLogEntry[]>([])
  const [dailyCheckIns, setDailyCheckIns] = useState<DailyCheckIn[]>([])
  useEffect(() => {
    fetchLogEntries().then((entries) => {
      setLogEntries(entries)
    })
    fetchDailyCheckIns().then((checkIns) => {
      setDailyCheckIns(checkIns)
    })
  }, [])

  useEffect(() => {
    setDailyLogData(serializeDailyLogData(logEntries, dailyCheckIns))
  }, [dailyCheckIns, logEntries])

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

  const deleteLogEntry = async (deletedLogEntry: SymptomLogEntry) => {
    const entriesWithoutTheDeletedLog = logEntries.filter((entry) => {
      return entry.id !== deletedLogEntry.id
    })
    setLogEntries(entriesWithoutTheDeletedLog)
  }

  return (
    <SymptomLogContext.Provider
      value={{
        dailyLogData,
        addLogEntry,
        updateLogEntry,
        deleteLogEntry,
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
