import { Factory } from "fishery"
import {
  CovidDataContextState,
  CovidDataRequestStatus,
} from "../CovidDataContext"
import covidData from "./covidData"

export default Factory.define<CovidDataContextState>(() => ({
  stateAbbreviation: "state",
  covidDataRequest: {
    status: CovidDataRequestStatus.MISSING_INFO,
    todayData: covidData.build(),
    trendReferenceData: covidData.build(),
    collectionForTrend: [],
  },
}))
