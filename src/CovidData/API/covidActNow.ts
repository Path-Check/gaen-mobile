import { JsonDecoder } from "ts-data-json"
import env from "react-native-config"

import Logger from "../../logger"
import { CovidData, CovidDatum } from "../covidData"

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
  data: CovidData
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
  actuals: Actuals
  actualsTimeseries: ActualsTimeseries
}

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
  "WithData",
)

const ActualsDatumDecoder = JsonDecoder.combine(ActualsDecoder, DateDecoder)

const StateTimeseriesDecoder = JsonDecoder.object<StateCovidData>(
  {
    fips: JsonDecoder.string,
    country: JsonDecoder.string,
    actuals: ActualsDecoder,
    actualsTimeseries: JsonDecoder.array(
      JsonDecoder.failover(null, ActualsDatumDecoder),
      "ActualsTimeseries",
    ),
  },
  "StateTimeseriesDecoder",
)

const toCovidData = (stateData: StateCovidData): CovidData => {
  const timeseries = stateData.actualsTimeseries

  const compact = <T>(arr: Array<T | null>): T[] => {
    return arr.reduce<T[]>((acc: T[], el: T | null) => {
      if (el) {
        return [el, ...acc]
      } else {
        return acc
      }
    }, [])
  }

  const toCovidDatum = (actualsDatum: ActualsDatum): CovidDatum => {
    return {
      date: actualsDatum.date,
      positiveCasesNew: actualsDatum.newCases,
      positiveCasesTotal: actualsDatum.cases,
    }
  }

  return compact(timeseries).map(toCovidDatum)
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
