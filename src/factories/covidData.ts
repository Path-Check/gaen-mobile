import { Factory } from "fishery"
import { CovidData } from "../CovidDataDashboard/covidDataAPI"

export default Factory.define<CovidData>(() => ({
  peopleDeathCt: 0,
  peopleDeathNewCt: 0,
  peoplePositiveCasesCt: 0,
  peoplePositiveNewCasesCt: 0,
}))
