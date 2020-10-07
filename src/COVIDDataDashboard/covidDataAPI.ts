import { Posix, posixToDayjs } from "../utils/dateTime"
import Logger from "../logger"

const COVID_DATA_ENDPOINT = "https://api.covidtracking.com/v1/states/"
const DATE_ARGUMENT_FORMAT = "YYYYDDMM"
const ENDPOINT_FORMAT = "json"

const requestHeaders = {
  "content-type": "application/json",
  accept: "application/json",
}

export type CovidData = {
  positive: number
  totalTestResults: number
  hospitalizedCurrently: number
  inIcuCurrently: number
  death: number
  positiveIncrease: number
  totalTestResultsIncrease: number
  deathIncrease: number
}

export interface RequestSuccess {
  kind: "success"
  covidData: CovidData
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

const isValidCovidDataResponse = (jsonResponse: Record<string, number>) => {
  return jsonResponse["positive"] >= 0 && jsonResponse["totalTestResults"] >= 0
}

export const fetchCovidDataForState = async (
  state: string,
  date?: Posix,
): Promise<RequestSuccess | RequestFailure> => {
  const dateForTheData = date || Date.now()
  const dayJsDate = posixToDayjs(dateForTheData)
  if (dayJsDate === null) {
    return {
      kind: "failure",
      nature: "InternalError",
    }
  }

  const dateString = dayJsDate.local().format(DATE_ARGUMENT_FORMAT)

  const endpointURL = `${COVID_DATA_ENDPOINT}/${state}/${dateString}.${ENDPOINT_FORMAT}`
  try {
    const response = await fetch(endpointURL, {
      method: "GET",
      headers: requestHeaders,
    })

    const jsonResponse = await response.json()

    if (isValidCovidDataResponse(jsonResponse)) {
      return {
        kind: "success",
        covidData: jsonResponse as CovidData,
      }
    } else {
      Logger.error("Invalid response for covid data", {
        jsonResponse,
        state,
        dateString,
      })
      return { kind: "failure", nature: "RequestFailed" }
    }
  } catch (e) {
    Logger.error("Exception retrieving covid data", {
      message: e.message,
      state,
      dateString,
    })
    if (e.message === "Network request failed") {
      return { kind: "failure", nature: "NetworkConnection" }
    } else {
      return { kind: "failure", nature: "Unknown" }
    }
  }
}
