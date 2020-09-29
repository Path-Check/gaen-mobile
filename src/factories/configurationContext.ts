import { Factory } from "fishery"
import { Configuration } from "../ConfigurationContext"

export default Factory.define<Configuration>(() => ({
  appDownloadLink: "appDownloadLink",
  appPackageName: "appPackageName",
  displayAcceptTermsOfService: false,
  displayCallbackForm: false,
  displayMyHealth: false,
  displaySelfScreener: false,
  emergencyPhoneNumber: "emergencyPhoneNumber",
  findATestCenterUrl: "findATestCenterUrl",
  healthAuthorityAdviceUrl: "authorityAdviceUrl",
  healthAuthorityLearnMoreUrl: "authorityLearnMoreUrl",
  healthAuthorityEulaUrl: "healthAuthorityEulaUrl",
  healthAuthorityName: "authorityName",
  healthAuthorityPrivacyPolicyUrl: "authorityPrivacyPolicyUrl",
  healthAuthorityLegalPrivacyPolicyUrl: "authorityLegalPrivacyPolicyUrl",
  healthAuthoritySupportsAnalytics: false,
  healthAuthorityAnalyticsUrl: null,
  healthAuthorityAnalyticsSiteId: null,
  regionCodes: ["REGION"],
}))
