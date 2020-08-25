import { register } from "fishery"
import tracingStrategy from "./tracingStrategy"
import exposureDatum from "./exposureDatum"
import rawExposure from "./rawExposure"
import exposureContext from "./exposureContext"
import configurationContext from "./configurationContext"

export const factories = register({
  configurationContext,
  exposureContext,
  exposureDatum,
  rawExposure,
  tracingStrategy,
})
