import Logger from "../logger"

const COVID_DATA_ENDPOINT =
  "https://localcoviddata.com/covid19/v1/cases/covidTracking?state="
const DAYS_IN_PAST_PARAM = "&daysInPast=7"
const DATA_KEY = "historicData"

const requestHeaders = {
  "content-type": "application/json",
  accept: "application/json",
}

export type CovidData = {
  peoplePositiveCasesCt: number
  peoplePositiveNewCasesCt: number
  peopleDeathCt: number
  peopleDeathNewCt: number
}

const toCovidData = (jsonResponse: Record<string, string>[]): CovidData[] => {
  return jsonResponse.map((json) => {
    return {
      peoplePositiveNewCasesCt: parseInt(json["peoplePositiveNewCasesCt"]),
      peoplePositiveCasesCt: parseInt(json["peoplePositiveCasesCt"]),
      peopleDeathNewCt: parseInt(json["peopleDeathNewCt"]),
      peopleDeathCt: parseInt(json["peopleDeathCt"]),
    }
  })
}

export interface RequestSuccess {
  kind: "success"
  lastWeekCovidData: CovidData[]
}

type FailureNature =
  | "InternalError"
  | "RequestFailed"
  | "NetworkConnection"
  | "Unknown"

export interface RequestFailure {
  kind: "failure"
  nature: FailureNature
}

const isValidCovidDataResponse = (jsonResponse: Record<string, string>) => {
  return (
    parseInt(jsonResponse["peoplePositiveNewCasesCt"]) >= 0 &&
    parseInt(jsonResponse["peoplePositiveCasesCt"]) >= 0 &&
    parseInt(jsonResponse["peopleDeathNewCt"]) >= 0 &&
    parseInt(jsonResponse["peopleDeathCt"]) >= 0
  )
}

export const fetchCovidDataForState = async (
  state: string,
): Promise<RequestSuccess | RequestFailure> => {
  const endpointURL = `${COVID_DATA_ENDPOINT}${state}${DAYS_IN_PAST_PARAM}`
  try {
    const response = await fetch(endpointURL, {
      method: "GET",
      headers: requestHeaders,
    })

    const jsonResponse = await response.json()
    const historicData = jsonResponse[DATA_KEY]

    if (historicData.every(isValidCovidDataResponse)) {
      return {
        kind: "success",
        lastWeekCovidData: toCovidData(jsonResponse[DATA_KEY]),
      }
    } else {
      Logger.error("Invalid response for covid data", {
        jsonResponse,
        state,
      })
      return { kind: "failure", nature: "RequestFailed" }
    }
  } catch (e) {
    Logger.error("Exception retrieving covid data", {
      message: e.message,
      state,
    })
    if (e.message === "Network request failed") {
      return { kind: "failure", nature: "NetworkConnection" }
    } else {
      return { kind: "failure", nature: "Unknown" }
    }
  }
}
