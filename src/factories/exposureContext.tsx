import { Factory } from "fishery"
import { ExposureState } from "../ExposureContext"

export default Factory.define<ExposureState>(() => ({
  exposureInfo: [],
  hasBeenExposed: false,
  userHasNewExposure: true,
  observeExposures: (): void => {},
  resetExposures: (): void => {},
  getCurrentExposures: (): void => {},
  getExposureKeys: () => Promise.resolve([]),
  submitDiagnosisKeys: () => Promise.resolve(""),
  lastExposureDetectionDate: null,
}))
