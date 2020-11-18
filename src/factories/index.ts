import { register } from "fishery"

import productAnalyticsContext from "./productAnalyticsContext"
import configurationContext from "./configurationContext"
import covidDataContext from "./covidDataContext"
import exposureContext from "./exposureContext"
import exposureDatum from "./exposureDatum"
import permissionsContext from "./permissionsContext"
import rawExposure from "./rawExposure"
import selfAssessmentAnswers from "./selfAssessmentAnswers"
import selfAssessmentContext from "./selfAssessmentContext"
import symptomHistoryContext from "./symptomHistoryContext"
import { covidData, covidDatum } from "./covidData"

export const factories = register({
  productAnalyticsContext,
  configurationContext,
  covidData,
  covidDataContext,
  covidDatum,
  exposureContext,
  exposureDatum,
  permissionsContext,
  rawExposure,
  selfAssessmentAnswers,
  selfAssessmentContext,
  symptomHistoryContext,
})
