import { Factory } from "fishery"
import { CovidDataContextState } from "../CovidData/Context"

export default Factory.define<CovidDataContextState>(() => ({
  locationName: "state",
  request: {
    status: "MISSING_INFO",
    data: [],
  },
}))
