import { Factory } from "fishery"
import { Configuration } from "../ConfigurationContext"

export default Factory.define<Configuration>(() => ({
  appDownloadLink: "appDownloadLink",
  appPackageName: "appPackageName",
  displayReportAnIssue: false,
  displaySelfAssessment: false,
  healthAuthorityAdviceUrl: "authorityAdviceUrl",
  healthAuthorityName: "authorityName",
  healthAuthorityPrivacyPolicyUrl: "authorityPrivacyPolicyUrl",
  regionCodes: ["REGION"],
}))
