import { register } from "fishery"
import analyticsContext from "./analyticsContext"
import configurationContext from "./configurationContext"
import exposureContext from "./exposureContext"
import exposureDatum from "./exposureDatum"
import gaenStrategy from "./gaenStrategy"
import symptomLogContext from "./symptomLogContext"
import selfScreenerContext from "./selfScreenerContext"
import rawExposure from "./rawExposure"

export const factories = register({
  analyticsContext,
  configurationContext,
  exposureContext,
  exposureDatum,
  gaenStrategy,
  symptomLogContext,
  selfScreenerContext,
  rawExposure,
})
