import { Factory } from "fishery"
import { CovidData, CovidDatum } from "../CovidData/covidData"

export const covidDatum = Factory.define<CovidDatum>(() => {
  return {
    date: "2020-01-01",
    deathsTotal: 0,
    deathsNew: 0,
    positiveCasesTotal: 0,
    positiveCasesNew: 0,
  }
})

export const covidData = Factory.define<CovidData>(() => [
  {
    date: "2020-01-01",
    deathsTotal: 0,
    deathsNew: 0,
    positiveCasesTotal: 0,
    positiveCasesNew: 0,
  },
])
