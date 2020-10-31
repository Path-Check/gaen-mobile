import { register } from "fishery"

import analyticsContext from "./analyticsContext"
import configurationContext from "./configurationContext"
import covidDataContext from "./covidDataContext"
import exposureContext from "./exposureContext"
import exposureDatum from "./exposureDatum"
import gaenStrategy from "./gaenStrategy"
import permissionsContext from "./permissionsContext"
import rawExposure from "./rawExposure"
import selfAssessmentAnswers from "./selfAssessmentAnswers"
import selfAssessmentContext from "./selfAssessmentContext"
import symptomHistoryContext from "./symptomHistoryContext"
import { covidData, covidDatum } from "./covidData"

export const factories = register({
  analyticsContext,
  configurationContext,
  covidData,
  covidDataContext,
  covidDatum,
  exposureContext,
  exposureDatum,
  gaenStrategy,
  permissionsContext,
  rawExposure,
  selfAssessmentAnswers,
  selfAssessmentContext,
  symptomHistoryContext,
})
