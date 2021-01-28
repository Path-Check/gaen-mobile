import { Factory } from "fishery"

import { AffectedUserContextState } from "../AffectedUserFlow/AffectedUserContext"

export default Factory.define<AffectedUserContextState>(() => ({
  hmacKey: "hmacKey",
  certificate: "certificate",
  exposureKeys: [],
  setExposureKeys: () => {},
  setExposureSubmissionCredentials: () => {},
  navigateOutOfStack: () => {},
  linkCode: undefined,
  setLinkCode: () => {},
  symptomOnsetDate: 0,
  setSymptomOnsetDate: () => {},
}))
