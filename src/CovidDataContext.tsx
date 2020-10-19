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
  MISSING_INFO,
}

type RequestDataPortion = {
  todayData: CovidData
  trendReferenceData: CovidData
  collectionForTrend: CovidData[]
}

type CovidDataRequest = RequestDataPortion & {
  status: CovidDataRequestStatus
}

export type CovidDataContextState = {
  stateAbbreviation: string
  covidDataRequest: CovidDataRequest
}

const placeHolderData: CovidData = {
  peoplePositiveCasesCt: 0,
  peopleDeathCt: 0,
  peoplePositiveNewCasesCt: 0,
  peopleDeathNewCt: 0,
}

const initialState: CovidDataContextState = {
  stateAbbreviation: "",
  covidDataRequest: {
    status: CovidDataRequestStatus.MISSING_INFO,
    todayData: placeHolderData,
    trendReferenceData: placeHolderData,
    collectionForTrend: [],
  },
}

export const CovidDataContext = createContext<CovidDataContextState>(
  initialState,
)

export const CovidDataContextProvider: FunctionComponent = ({ children }) => {
  const { stateAbbreviation, displayCovidData } = useConfigurationContext()
  const [covidDataRequest, setCovidDataRequest] = useState(
    initialState.covidDataRequest,
  )

  const parseLastWeekCovidData = (
    lastWeekData: CovidData[],
  ): RequestDataPortion => {
    const sortedData = lastWeekData.sort((leftCovidData, rightCovidData) => {
      return Math.sign(
        rightCovidData.peoplePositiveCasesCt -
          leftCovidData.peoplePositiveCasesCt,
      )
    })

    const [todayData, ...collectionForTrend] = sortedData
    const [trendReferenceData] = collectionForTrend
    return {
      todayData,
      trendReferenceData,
      collectionForTrend,
    }
  }

  const fetchCovidData = useCallback(async (stateCode: string) => {
    setCovidDataRequest({
      ...initialState.covidDataRequest,
      status: CovidDataRequestStatus.LOADING,
    })

    const covidDataResponse = await fetchCovidDataForState(stateCode)

    if (covidDataResponse.kind === "success") {
      const {
        todayData,
        trendReferenceData,
        collectionForTrend,
      } = parseLastWeekCovidData(covidDataResponse.lastWeekCovidData)

      if (trendReferenceData && todayData) {
        setCovidDataRequest({
          status: CovidDataRequestStatus.SUCCESS,
          todayData,
          trendReferenceData,
          collectionForTrend,
        })
      } else {
        setCovidDataRequest({
          ...initialState.covidDataRequest,
          status: CovidDataRequestStatus.MISSING_INFO,
        })
      }
    } else {
      setCovidDataRequest({
        ...initialState.covidDataRequest,
        status: CovidDataRequestStatus.ERROR,
      })
    }
  }, [])

  useEffect(() => {
    if (displayCovidData && stateAbbreviation !== null) {
      fetchCovidData(stateAbbreviation)
    }
  }, [displayCovidData, stateAbbreviation, fetchCovidData])

  return (
    <CovidDataContext.Provider
      value={{ covidDataRequest, stateAbbreviation: stateAbbreviation || "" }}
    >
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
