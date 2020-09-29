import { register } from "fishery"
import analyticsContext from "./analyticsContext"
import configurationContext from "./configurationContext"
import dayLogData from "./dayLogData"
import exposureContext from "./exposureContext"
import exposureDatum from "./exposureDatum"
import gaenStrategy from "./gaenStrategy"
import symptomLogContext from "./symptomLogContext"
import rawExposure from "./rawExposure"

export const factories = register({
  analyticsContext,
  configurationContext,
  dayLogData,
  exposureContext,
  exposureDatum,
  gaenStrategy,
  symptomLogContext,
  rawExposure,
})
