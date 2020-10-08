import { register } from "fishery"
import analyticsContext from "./analyticsContext"
import configurationContext from "./configurationContext"
import exposureContext from "./exposureContext"
import exposureDatum from "./exposureDatum"
import gaenStrategy from "./gaenStrategy"
import symptomLogContext from "./symptomLogContext"
import selfScreenerContext from "./selfScreenerContext"
import selfScreenerAnswers from "./selfScreenerAnswers"
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
  selfScreenerContext,
  selfScreenerAnswers,
  rawExposure,
})
