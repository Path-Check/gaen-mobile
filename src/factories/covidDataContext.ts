import { Factory } from "fishery"

import { CovidDataContextState } from "../CovidData/Context"
import * as CovidData from "../CovidData/covidData"

export default Factory.define<CovidDataContextState>(() => ({
  locationName: "state",
  request: {
    status: "MISSING_INFO",
    data: CovidData.initial,
  },
}))
