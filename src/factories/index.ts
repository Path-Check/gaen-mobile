import { register } from "fishery"
import analyticsContext from "./analyticsContext"
import configurationContext from "./configurationContext"
import exposureContext from "./exposureContext"
import exposureDatum from "./exposureDatum"
import gaenStrategy from "./gaenStrategy"
import symptomLogContext from "./symptomLogContext"
import selfAssessmentContext from "./selfAssessmentContext"
import selfAssessmentAnswers from "./selfAssessmentAnswers"
import rawExposure from "./rawExposure"
import covidData from "./covidData"

export const factories = register({
  analyticsContext,
  configurationContext,
  covidData,
  exposureContext,
  exposureDatum,
  gaenStrategy,
  symptomLogContext,
  selfAssessmentContext,
  selfAssessmentAnswers,
  rawExposure,
})
