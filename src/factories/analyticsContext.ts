import { Factory } from "fishery"
import { AnalyticsContextState } from "../ProductAnalytics/Context"

export default Factory.define<AnalyticsContextState>(() => ({
  userConsentedToAnalytics: false,
  updateUserConsent: () => Promise.resolve(),
  trackEvent: () => Promise.resolve(),
  trackScreenView: () => Promise.resolve(),
}))
