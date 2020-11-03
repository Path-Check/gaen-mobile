import { Factory } from "fishery"
import { AnalyticsContextState } from "../ProductAnalytics/Context"

export default Factory.define<AnalyticsContextState>(() => ({
  userConsentedToAnalytics: false,
  updateUserConsent: () => Promise.resolve(),
  trackEvent: () => Promise.resolve(true),
  trackScreenView: () => Promise.resolve(),
}))
