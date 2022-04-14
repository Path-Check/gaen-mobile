import { Factory } from "fishery"
import { Configuration } from "../configuration/configurationInterface"

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
  displayRequestCallbackUrl: false,
  displayQuarantineRecommendation: true,
  displaySymptomHistory: false,
  displaySelfAssessment: false,
  displayAgeVerification: false,
  enableProductAnalytics: false,
  enxRegion: "",
  enxNotificationText: "Click here to enable the new Exposure Notifications. In order to stay protected from COVID-19, you need to take this step. After that, this app can be safely deleted.",
  externalCovidDataLabel: "home.covid_data",
  externalCovidDataLink: null,
  externalTravelGuidanceLink: null,
  emergencyPhoneNumber: "emergencyPhoneNumber",
  findATestCenterUrl: "findATestCenterUrl",
  healthAuthorityAdviceUrl: "authorityAdviceUrl",
  healthAuthorityCovidDataUrl: "authorityCovidDataUrl",
  healthAuthorityCovidDataWebViewUrl: "authorityCovidDataWebViewUrl",
  healthAuthorityHealthCheckUrl: "healthAuthorityHealthCheckUrl",
  healthAuthorityLearnMoreUrl: "authorityLearnMoreUrl",
  healthAuthorityEulaUrl: "healthAuthorityEulaUrl",
  healthAuthorityPrivacyPolicyUrl: "authorityPrivacyPolicyUrl",
  healthAuthorityRequestCallbackNumber: "healthAuthorityRequestCallbackNumber",
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
