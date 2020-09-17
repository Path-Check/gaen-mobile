import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react"

import { SymptomLogEntry, HealthAssessment } from "./symptoms"

const fetchLogEntries = (): Promise<SymptomLogEntry[]> => {
  return Promise.resolve([
    {
      id: 1,
      symptoms: [],
      healthAssessment: HealthAssessment.NotAtRisk,
      date: new Date().getTime() / 1000,
    },
  ])
}

export type SymptomLogState = {
  logEntries: SymptomLogEntry[]
  addLogEntry: (entry: SymptomLogEntry) => Promise<void>
  updateLogEntry: (entry: SymptomLogEntry) => Promise<void>
  deleteLogEntry: (entry: SymptomLogEntry) => Promise<void>
}

const initialState = {
  logEntries: [],
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
  const [logEntries, setLogEntries] = useState<SymptomLogEntry[]>([])
  useEffect(() => {
    fetchLogEntries().then((entries) => {
      setLogEntries(entries)
    })
  }, [])

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
        logEntries,
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
