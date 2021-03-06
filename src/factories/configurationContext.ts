import { Factory } from "fishery"
import { Configuration } from "../ConfigurationContext"

export default Factory.define<Configuration>(() => ({
  appDownloadUrl: "appDownloadUrl",
  appPackageName: "appPackageName",
  cdcGuidanceUrl: "cdcGuidanceUrl",
  cdcSymptomsUrl: "cdcSymptomsUrl",
  displayAcceptTermsOfService: false,
  displayAppTransition: false,
  displayCallbackForm: false,
  displayCallEmergencyServices: false,
  displayCovidData: false,
  displayCovidDataWebView: false,
  displaySymptomHistory: false,
  displaySelfAssessment: false,
  displayAgeVerification: false,
  enableProductAnalytics: false,
  emergencyPhoneNumber: "emergencyPhoneNumber",
  findATestCenterUrl: "findATestCenterUrl",
  healthAuthorityAdviceUrl: "authorityAdviceUrl",
  healthAuthorityCovidDataUrl: "authorityCovidDataUrl",
  healthAuthorityCovidDataWebViewUrl: "authorityCovidDataWebViewUrl",
  healthAuthorityHealthCheckUrl: "healthAuthorityHealthCheckUrl",
  healthAuthorityLearnMoreUrl: "authorityLearnMoreUrl",
  healthAuthorityEulaUrl: "healthAuthorityEulaUrl",
  healthAuthorityPrivacyPolicyUrl: "authorityPrivacyPolicyUrl",
  healthAuthorityLegalPrivacyPolicyUrl: "authorityLegalPrivacyPolicyUrl",
  healthAuthorityVerificationCodeInfoUrl: "authorityVerificationCodeInfoUrl",
  includeSymptomOnsetDate: false,
  measurementSystem: "Imperial",
  minimumAge: "18",
  minimumPhoneDigits: 0,
  quarantineLength: 14,
  regionCodes: ["REGION"],
  remoteContentUrl: null,
  stateAbbreviation: null,
  supportPhoneNumber: null,
  verificationStrategy: "Simple",
}))
