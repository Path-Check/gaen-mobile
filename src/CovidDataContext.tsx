import React, {
  createContext,
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react"
import { useConfigurationContext } from "./ConfigurationContext"

import {
  CovidData,
  fetchCovidDataForState,
} from "./CovidDataDashboard/covidDataAPI"

export enum CovidDataRequestStatus {
  SUCCESS,
  LOADING,
  ERROR,
  NOT_STARTED,
}

type CovidDataRequest = {
  status: CovidDataRequestStatus
  data: CovidData[]
}

export type CovidDataContextState = {
  covidDataRequest: CovidDataRequest
}

const initialState: CovidDataContextState = {
  covidDataRequest: {
    status: CovidDataRequestStatus.NOT_STARTED,
    data: [],
  },
}

export const CovidDataContext = createContext<CovidDataContextState>(
  initialState,
)

export const CovidDataContextProvider: FunctionComponent = ({ children }) => {
  const { stateAbbreviation } = useConfigurationContext()
  const [covidDataRequest, setCovidDataRequest] = useState(
    initialState.covidDataRequest,
  )

  const fetchCovidData = useCallback(async (stateCode: string) => {
    setCovidDataRequest({
      status: CovidDataRequestStatus.LOADING,
      data: [],
    })

    const covidDataResponse = await fetchCovidDataForState(stateCode)
    if (covidDataResponse.kind === "success") {
      setCovidDataRequest({
        status: CovidDataRequestStatus.SUCCESS,
        data: covidDataResponse.lastWeekCovidData,
      })
    } else {
      setCovidDataRequest({
        status: CovidDataRequestStatus.ERROR,
        data: [],
      })
    }
  }, [])

  useEffect(() => {
    stateAbbreviation && fetchCovidData(stateAbbreviation)
  }, [stateAbbreviation, fetchCovidData])

  return (
    <CovidDataContext.Provider value={{ covidDataRequest }}>
      {children}
    </CovidDataContext.Provider>
  )
}

export const useCovidDataContext = (): CovidDataContextState => {
  const context = useContext(CovidDataContext)
  if (context === undefined) {
    throw new Error("CovidDataContext must be used with a provider")
  }
  return context
}
