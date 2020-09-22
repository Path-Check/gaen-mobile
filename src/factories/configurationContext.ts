import { Factory } from "fishery"
import { Configuration } from "../ConfigurationContext"

export default Factory.define<Configuration>(() => ({
  appDownloadLink: "appDownloadLink",
  appPackageName: "appPackageName",
  displayAcceptTermsOfService: false,
  displayReportAnIssue: false,
  displaySelfAssessment: false,
  displayCallbackForm: false,
  displayMyHealth: false,
  findATestCenterUrl: "findATestCenterUrl",
  healthAuthorityAdviceUrl: "authorityAdviceUrl",
  healthAuthorityLearnMoreUrl: "authorityLearnMoreUrl",
  healthAuthorityEulaUrl: "healthAuthorityEulaUrl",
  healthAuthorityName: "authorityName",
  healthAuthorityPrivacyPolicyUrl: "authorityPrivacyPolicyUrl",
  healthAuthorityLegalPrivacyPolicyUrl: "authorityLegalPrivacyPolicyUrl",
  healthAuthoritySupportsAnalytics: false,
  regionCodes: ["REGION"],
}))
