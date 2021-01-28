import { JsonDecoder } from "ts-data-json"

import Logger from "../../logger"
import * as CovidData from "../covidData"

const COVID_DATA_ENDPOINT =
  "https://localcoviddata.com/covid19/v1/cases/covidTracking?state="
const DAYS_IN_PAST_PARAM = "&daysInPast=7"

const requestHeaders = {
  "content-type": "application/json",
  accept: "application/json",
}

export type NetworkResponse = RequestSuccess | RequestFailure

export interface RequestSuccess {
  kind: "success"
  data: CovidData.CovidData
}

type NetworkError =
  | "BadRequest"
  | "InternalError"
  | "JsonDeserialization"
  | "NetworkConnection"
  | "Unknown"

export interface RequestFailure {
  kind: "failure"
  error: NetworkError
}

type StateData = {
  stateName: string
  stateCode: string
  historicData: NetworkData
}

type NetworkData = StateDatum[]

type Date = string

type StateDatum = {
  date: Date
  peoplePositiveCasesCt: number
  peoplePositiveNewCasesCt: number
  peopleNegativeCasesCt: number
  peopleNegativeNewCt: number
  peoplePendingCasesCt: number
  peopleRecoveredCt: number
  peopleDeathCt: number
  peopleDeathNewCt: number
  peopleHospCurrentlyCt: number
  peopleHospNewCt: number
  peopleHospCumlCt: number
  peopleInIntnsvCareCurrCt: number
  peopleInIntnsvCareCumlCt: number
  peopleIntubatedCurrentlyCt: number
  peopleIntubatedCumulativeCt: number
}

const StateDatumDecoder = JsonDecoder.object<StateDatum>(
  {
    date: JsonDecoder.string,
    peoplePositiveCasesCt: JsonDecoder.number,
    peoplePositiveNewCasesCt: JsonDecoder.number,
    peopleNegativeCasesCt: JsonDecoder.number,
    peopleNegativeNewCt: JsonDecoder.number,
    peoplePendingCasesCt: JsonDecoder.number,
    peopleRecoveredCt: JsonDecoder.number,
    peopleDeathCt: JsonDecoder.number,
    peopleDeathNewCt: JsonDecoder.number,
    peopleHospCurrentlyCt: JsonDecoder.number,
    peopleHospNewCt: JsonDecoder.number,
    peopleHospCumlCt: JsonDecoder.number,
    peopleInIntnsvCareCurrCt: JsonDecoder.number,
    peopleInIntnsvCareCumlCt: JsonDecoder.number,
    peopleIntubatedCurrentlyCt: JsonDecoder.number,
    peopleIntubatedCumulativeCt: JsonDecoder.number,
  },
  "NetworkDatumDecoder",
)

const StateDataDecoder = JsonDecoder.object<StateData>(
  {
    stateName: JsonDecoder.string,
    stateCode: JsonDecoder.string,
    historicData: JsonDecoder.array(StateDatumDecoder, "ActualsTimeseries"),
  },
  "ResponseDecoder",
)

export const toCovidData = (stateData: StateData): CovidData.CovidData => {
  const toCovidDataDatum = (stateDatum: StateDatum): CovidData.CovidDatum => {
    const {
      date,
      peoplePositiveNewCasesCt: positiveCasesNew,
      peoplePositiveCasesCt: positiveCasesTotal,
    } = stateDatum

    return {
      date,
      positiveCasesNew,
      positiveCasesTotal,
    }
  }

  const networkData = stateData.historicData
  const timeseries = networkData.map(toCovidDataDatum)

  return {
    source: "localcoviddata.org",
    fips: "",
    country: "",
    state: "",
    population: 0,
    metrics: CovidData.initialMetrics,
    riskLevels: CovidData.initialRiskLevels,
    timeseries,
  }
}

export const fetchCovidDataForState = async (
  state: string,
): Promise<NetworkResponse> => {
  const endpointURL = `${COVID_DATA_ENDPOINT}${state}${DAYS_IN_PAST_PARAM}`

  try {
    const response = await fetch(endpointURL, {
      method: "GET",
      headers: requestHeaders,
    })

    const json = await response.json()

    const stateData = await StateDataDecoder.decodePromise(json)

    return {
      kind: "success",
      data: toCovidData(stateData),
    }
  } catch (e) {
    if (e.contains("decoder failed")) {
      Logger.error("Failed to desieralize covid api data", { url: endpointURL })
      return { kind: "failure", error: "JsonDeserialization" }
    }
    switch (e.message) {
      case "Network request failed": {
        return { kind: "failure", error: "NetworkConnection" }
      }
      case "JsonDeserialization": {
        return { kind: "failure", error: "JsonDeserialization" }
      }
      default: {
        return { kind: "failure", error: "Unknown" }
      }
    }
  }
}
