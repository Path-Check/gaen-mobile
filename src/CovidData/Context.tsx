import React, {
  createContext,
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react"
import { useConfigurationContext } from "../ConfigurationContext"

import * as CovidData from "./covidData"
import { fetchStateTimeseries, NetworkResponse } from "./API/covidActNow"

export type RequestStatus = "SUCCESS" | "LOADING" | "ERROR" | "MISSING_INFO"

export type CovidDataRequest = {
  status: RequestStatus
  data: CovidData.CovidData
  error?: string
}

export type CovidDataContextState = {
  locationName: string
  request: CovidDataRequest
}

const initialRequest: CovidDataRequest = {
  status: "MISSING_INFO",
  data: CovidData.initial,
}

const initialState: CovidDataContextState = {
  locationName: "",
  request: initialRequest,
}

export const CovidDataContext = createContext<CovidDataContextState>(
  initialState,
)

export const CovidDataContextProvider: FunctionComponent = ({ children }) => {
  const { stateAbbreviation, displayCovidData } = useConfigurationContext()

  const fetchCovidData = useCallback((): Promise<NetworkResponse> => {
    if (stateAbbreviation && displayCovidData) {
      return fetchStateTimeseries(stateAbbreviation)
    } else {
      return Promise.resolve({ kind: "failure", error: "BadRequest" })
    }
  }, [displayCovidData, stateAbbreviation])

  const request = useCovidDataRequest(fetchCovidData)

  const locationName = stateAbbreviation || ""

  return (
    <CovidDataContext.Provider value={{ request, locationName }}>
      {children}
    </CovidDataContext.Provider>
  )
}

const useCovidDataRequest = (
  fetchCovidData: () => Promise<NetworkResponse>,
) => {
  const [status, setStatus] = useState(initialRequest.status)
  const [data, setData] = useState(initialRequest.data)

  useEffect(() => {
    const f = async () => {
      setStatus("LOADING")
      const response = await fetchCovidData()

      if (response.kind === "success") {
        setStatus("SUCCESS")
        setData(response.data)
      } else {
        switch (response.error) {
          case "BadRequest": {
            setStatus("MISSING_INFO")
            break
          }
          default: {
            setStatus("ERROR")
          }
        }
      }
    }

    f()
  }, [fetchCovidData])

  return { status, data }
}

export const useCovidDataContext = (): CovidDataContextState => {
  const context = useContext(CovidDataContext)
  if (context === undefined) {
    throw new Error("CovidDataContext must be used with a provider")
  }
  return context
}
