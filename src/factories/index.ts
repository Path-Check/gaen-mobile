import affectedUserFlowContext from "./affectedUserFlowContext"
import configurationContext from "./configurationContext"
import covidDataContext from "./covidDataContext"
import exposureContext from "./exposureContext"
import exposureDatum from "./exposureDatum"
import permissionsContext from "./permissionsContext"
import productAnalyticsContext from "./productAnalyticsContext"
import rawExposure from "./rawExposure"
import selfAssessmentAnswers from "./selfAssessmentAnswers"
import selfAssessmentContext from "./selfAssessmentContext"
import symptomHistoryContext from "./symptomHistoryContext"
import { covidData, covidDatum } from "./covidData"

export const factories = {
  affectedUserFlowContext,
  configurationContext,
  covidData,
  covidDataContext,
  covidDatum,
  exposureContext,
  exposureDatum,
  permissionsContext,
  productAnalyticsContext,
  rawExposure,
  selfAssessmentAnswers,
  selfAssessmentContext,
  symptomHistoryContext,
}
