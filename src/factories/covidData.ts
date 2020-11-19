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

export const covidData = Factory.define<CovidData>(() => {
  return {
    source: "test-source",
    fips: "test-fips",
    country: "test-country",
    state: "test-state",
    population: 100000,
    metrics: {
      testPositivityRatio: 0,
      caseDensity: 0,
      contactTracerCapacityRatio: 0,
      infectionRate: 0,
      icuHeadroomRatio: 0,
    },
    riskLevels: {
      overall: 0,
      testPositivityRatio: 0,
      caseDensity: 0,
      contactTracerCapacityRatio: 0,
      infectionRate: 0,
      icuHeadroomRatio: 0,
    },
    timeseries: [
      {
        date: "2020-01-01",
        deathsTotal: 0,
        deathsNew: 0,
        positiveCasesTotal: 0,
        positiveCasesNew: 0,
      },
    ],
  }
})
