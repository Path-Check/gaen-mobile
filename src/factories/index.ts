import { register } from "fishery"
import analyticsContext from "./analyticsContext"
import gaenStrategy from "./gaenStrategy"
import exposureDatum from "./exposureDatum"
import rawExposure from "./rawExposure"
import exposureContext from "./exposureContext"
import configurationContext from "./configurationContext"

export const factories = register({
  analyticsContext,
  configurationContext,
  exposureContext,
  exposureDatum,
  rawExposure,
  gaenStrategy,
})
