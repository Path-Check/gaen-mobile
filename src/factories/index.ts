import { register } from "fishery"
import analyticsContext from "./analyticsContext"
import configurationContext from "./configurationContext"
import exposureContext from "./exposureContext"
import exposureDatum from "./exposureDatum"
import gaenStrategy from "./gaenStrategy"
import symptomHistoryContext from "./symptomHistoryContext"
import selfAssessmentContext from "./selfAssessmentContext"
import selfAssessmentAnswers from "./selfAssessmentAnswers"
import rawExposure from "./rawExposure"
import covidData from "./covidData"
import covidDataContext from "./covidDataContext"

export const factories = register({
  analyticsContext,
  configurationContext,
  covidData,
  covidDataContext,
  exposureContext,
  exposureDatum,
  gaenStrategy,
  symptomHistoryContext,
  selfAssessmentContext,
  selfAssessmentAnswers,
  rawExposure,
})
