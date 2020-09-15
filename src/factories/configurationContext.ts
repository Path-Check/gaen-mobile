import { Factory } from "fishery"
import { Configuration } from "../ConfigurationContext"

export default Factory.define<Configuration>(() => ({
  appDownloadLink: "appDownloadLink",
  appPackageName: "appPackageName",
  displayAcceptTermsOfService: false,
  displayReportAnIssue: false,
  displaySelfAssessment: false,
  displayCallbackForm: false,
  displaySymptomChecker: false,
  healthAuthorityAdviceUrl: "authorityAdviceUrl",
  healthAuthorityEulaUrl: "healthAuthorityEulaUrl",
  healthAuthorityName: "authorityName",
  healthAuthorityPrivacyPolicyUrl: "authorityPrivacyPolicyUrl",
  regionCodes: ["REGION"],
}))
