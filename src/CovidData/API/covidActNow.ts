import { JsonDecoder } from "ts-data-json"
import env from "react-native-config"

import Logger from "../../logger"
import * as CovidData from "../covidData"

const API_KEY = env.COVID_ACT_NOW_API_KEY

const BASE_URL = "https://api.covidactnow.org/v2/"
const apiParam = `apiKey=${API_KEY}`

const stateHistoryEndpoint = (state: string) => {
  return BASE_URL + `state/${state}.timeseries.json?` + apiParam
}

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

type Actuals = {
  cases: number
  newCases: number
  deaths: number | null
  positiveTests: number | null
  negativeTests: number | null
  contactTracers: number | null
}

type ActualsDatum = Actuals & WithDate

type WithDate = {
  date: string
}

type ActualsTimeseries = Array<ActualsDatum | null>

type StateCovidData = {
  fips: string
  country: string
  state: string
  population: number
  metrics: Metrics
  riskLevels: CovidData.RiskLevels
  actuals: Actuals
  actualsTimeseries: ActualsTimeseries
}

type Metrics = {
  testPositivityRatio: number
  caseDensity: number
  contactTracerCapacityRatio: number
  infectionRate: number
  icuHeadroomRatio: number
}

const MetricsDecoder = JsonDecoder.object<Metrics>(
  {
    testPositivityRatio: JsonDecoder.number,
    caseDensity: JsonDecoder.number,
    contactTracerCapacityRatio: JsonDecoder.number,
    infectionRate: JsonDecoder.number,
    icuHeadroomRatio: JsonDecoder.number,
  },
  "Metrics",
)

const RiskLevelsDecoder = JsonDecoder.object<CovidData.RiskLevels>(
  {
    overall: JsonDecoder.number,
    testPositivityRatio: JsonDecoder.number,
    caseDensity: JsonDecoder.number,
    contactTracerCapacityRatio: JsonDecoder.number,
    infectionRate: JsonDecoder.number,
    icuHeadroomRatio: JsonDecoder.number,
  },
  "RiskLevels",
)

const ActualsDecoder = JsonDecoder.object<Actuals>(
  {
    cases: JsonDecoder.number,
    newCases: JsonDecoder.number,
    deaths: JsonDecoder.nullable(JsonDecoder.number),
    positiveTests: JsonDecoder.nullable(JsonDecoder.number),
    negativeTests: JsonDecoder.nullable(JsonDecoder.number),
    contactTracers: JsonDecoder.nullable(JsonDecoder.number),
  },
  "Actuals",
)

const DateDecoder = JsonDecoder.object<WithDate>(
  {
    date: JsonDecoder.string,
  },
  "WithDate",
)

const ActualsDatumDecoder = JsonDecoder.combine(ActualsDecoder, DateDecoder)

const StateTimeseriesDecoder = JsonDecoder.object<StateCovidData>(
  {
    fips: JsonDecoder.string,
    country: JsonDecoder.string,
    state: JsonDecoder.string,
    population: JsonDecoder.number,
    metrics: MetricsDecoder,
    riskLevels: RiskLevelsDecoder,
    actuals: ActualsDecoder,
    actualsTimeseries: JsonDecoder.array(
      JsonDecoder.failover(null, ActualsDatumDecoder),
      "ActualsTimeseries",
    ),
  },
  "StateTimeseriesDecoder",
)

const toCovidData = (stateData: StateCovidData): CovidData.CovidData => {
  const {
    fips,
    country,
    state,
    population,
    actualsTimeseries,
    metrics,
    riskLevels,
  } = stateData

  const compact = <T>(arr: Array<T | null>): T[] => {
    return arr.reduce<T[]>((acc: T[], el: T | null) => {
      if (el) {
        return [el, ...acc]
      } else {
        return acc
      }
    }, [])
  }

  const toCovidDatum = (actualsDatum: ActualsDatum): CovidData.CovidDatum => {
    return {
      date: actualsDatum.date,
      positiveCasesNew: actualsDatum.newCases,
      positiveCasesTotal: actualsDatum.cases,
    }
  }

  const timeseries = compact(actualsTimeseries).map(toCovidDatum)

  return {
    source: "covidactnow.org",
    fips,
    country,
    state,
    population,
    metrics,
    riskLevels,
    timeseries,
  }
}

export const fetchStateTimeseries = async (
  state: string,
): Promise<NetworkResponse> => {
  const endpointUrl = stateHistoryEndpoint(state)
  try {
    const response = await fetch(endpointUrl, {
      method: "GET",
      headers: requestHeaders,
    })

    const json = await response.json()

    const stateData = await StateTimeseriesDecoder.decodePromise(json)

    return {
      kind: "success",
      data: toCovidData(stateData),
    }
  } catch (e) {
    if (e.contains("decoder failed")) {
      Logger.error("Failed to desieralize covid api data", { url: endpointUrl })
      return { kind: "failure", error: "JsonDeserialization" }
    }
    switch (e.message) {
      case "Network request failed": {
        return { kind: "failure", error: "NetworkConnection" }
      }
      default: {
        return { kind: "failure", error: "Unknown" }
      }
    }
  }
}
