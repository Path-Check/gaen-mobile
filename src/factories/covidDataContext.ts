import { Factory } from "fishery"
import {
  CovidDataContextState,
  CovidDataRequestStatus,
} from "../CovidDataContext"

export default Factory.define<CovidDataContextState>(() => ({
  covidDataRequest: { status: CovidDataRequestStatus.NOT_STARTED, data: [] },
}))
