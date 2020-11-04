import { Factory } from "fishery"
import { ProductAnalyticsContextState } from "../ProductAnalytics/Context"

export default Factory.define<ProductAnalyticsContextState>(() => ({
  userConsentedToAnalytics: false,
  updateUserConsent: () => Promise.resolve(),
  trackEvent: () => Promise.resolve(),
  trackScreenView: () => Promise.resolve(),
}))
