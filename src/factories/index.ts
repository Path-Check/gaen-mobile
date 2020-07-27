import { register } from "fishery"
import tracingStrategy from "./tracingStrategy"
import exposureDatum from "./exposureDatum"
import rawExposure from "./rawExposure"
import exposureContext from "./exposureContext"

export const factories = register({
  tracingStrategy,
  exposureDatum,
  rawExposure,
  exposureContext,
})
