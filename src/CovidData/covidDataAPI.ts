import Logger from "../logger"

import { CovidData, CovidDatum } from "./covidData"

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

interface NetworkModel {
  stateName: string
  stateCode: string
  historicData: NetworkData
}

type NetworkData = NetworkDatum[]

type Date = string

interface NetworkDatum {
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

export const toCovidData = (networkModel: NetworkModel): CovidData => {
  const toCovidDataDatum = (networkDatum: NetworkDatum): CovidDatum => {
    const {
      date,
      peoplePositiveNewCasesCt: positiveCasesNew,
      peoplePositiveCasesCt: positiveCasesTotal,
      peopleDeathCt: deathsTotal,
      peopleDeathNewCt: deathsNew,
    } = networkDatum

    return {
      date,
      positiveCasesNew,
      positiveCasesTotal,
      deathsTotal,
      deathsNew,
    }
  }

  const networkData = networkModel.historicData

  return networkData.map(toCovidDataDatum)
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

    const networkModel = parseResponseData(json, endpointURL)

    return {
      kind: "success",
      data: toCovidData(networkModel),
    }
  } catch (e) {
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

/*eslint @typescript-eslint/no-explicit-any: 0*/
const parseResponseData = (json: any, endpointUrl: string): NetworkModel => {
  const parseNetworkDatum = (datum: any): NetworkDatum => {
    const date = datum["date"]
    const peoplePositiveCasesCt = parseInt(datum["peoplePositiveCasesCt"])
    const peoplePositiveNewCasesCt = parseInt(datum["peoplePositiveNewCasesCt"])
    const peopleNegativeCasesCt = parseInt(datum["peopleNegativeCasesCt"])
    const peopleNegativeNewCt = parseInt(datum["peopleNegativeNewCt"])
    const peoplePendingCasesCt = parseInt(datum["peoplePendingCasesCt"])
    const peopleRecoveredCt = parseInt(datum["peopleRecoveredCt"])
    const peopleDeathCt = parseInt(datum["peopleDeathCt"])
    const peopleDeathNewCt = parseInt(datum["peopleDeathNewCt"])
    const peopleHospCurrentlyCt = parseInt(datum["peopleHospCurrentlyCt"])
    const peopleHospNewCt = parseInt(datum["peopleHospNewCt"])
    const peopleHospCumlCt = parseInt(datum["peopleHospCumlCt"])
    const peopleInIntnsvCareCurrCt = parseInt(datum["peopleInIntnsvCareCurrCt"])
    const peopleInIntnsvCareCumlCt = parseInt(datum["peopleInIntnsvCareCumlCt"])
    const peopleIntubatedCurrentlyCt = parseInt(
      datum["peopleIntubatedCurrentlyCt"],
    )
    const peopleIntubatedCumulativeCt = parseInt(
      datum["peopleIntubatedCumulativeCt"],
    )

    if (!date) {
      Logger.error("Invalid response for covid data api", {
        url: endpointUrl,
        json,
      })
      throw new Error("JsonDeserialization")
    }

    return {
      date,
      peoplePositiveCasesCt,
      peoplePositiveNewCasesCt,
      peopleNegativeCasesCt,
      peopleNegativeNewCt,
      peoplePendingCasesCt,
      peopleRecoveredCt,
      peopleDeathCt,
      peopleDeathNewCt,
      peopleHospCurrentlyCt,
      peopleHospNewCt,
      peopleHospCumlCt,
      peopleInIntnsvCareCurrCt,
      peopleInIntnsvCareCumlCt,
      peopleIntubatedCurrentlyCt,
      peopleIntubatedCumulativeCt,
    }
  }

  const historicData = json["historicData"].map(parseNetworkDatum)

  if (!historicData) {
    Logger.error("Invalid response for covid data api", {
      url: endpointUrl,
      json,
    })
    throw new Error("JsonDeserialization")
  }

  return {
    stateName: json["stateName"],
    stateCode: json["stateCode"],
    historicData,
  }
}
