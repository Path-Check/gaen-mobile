import { createContext } from "react"

import { Configuration } from "./configurationInterface"

const initialState: Configuration = {
  appDownloadUrl: null,
  appPackageName: "",
  cdcGuidanceUrl: null,
  cdcSymptomsUrl: null,
  displayAcceptTermsOfService: false,
  displayAppTransition: false,
  displayCallbackForm: false,
  displayRequestCallbackUrl: false,
  displayCallEmergencyServices: false,
  displayCovidData: false,
  displayCovidDataWebView: false,
  displayQuarantineRecommendation: true,
  displaySymptomHistory: false,
  displaySelfAssessment: false,
  displayAgeVerification: false,
  emergencyPhoneNumber: "",
  enableProductAnalytics: false,
  enxRegion: "",
  enxNotificationText:
    "Click here to enable the new Exposure Notifications. In order to stay protected from COVID-19, you need to take this step. After that, this app can be safely deleted.",
  externalCovidDataLabel: "home.covid_data",
  externalCovidDataLink: null,
  externalTravelGuidanceLink: null,
  findATestCenterUrl: null,
  healthAuthorityAdviceUrl: "",
  healthAuthorityCovidDataUrl: null,
  healthAuthorityCovidDataWebViewUrl: null,
  healthAuthorityEulaUrl: null,
  healthAuthorityHealthCheckUrl: null,
  healthAuthorityLearnMoreUrl: "",
  healthAuthorityLegalPrivacyPolicyUrl: "",
  healthAuthorityPrivacyPolicyUrl: "",
  healthAuthorityRequestCallbackNumber: "",
  healthAuthorityVerificationCodeInfoUrl: null,
  includeSymptomOnsetDate: false,
  measurementSystem: "Imperial" as const,
  minimumAge: "18",
  minimumPhoneDigits: 0,
  regionCodes: [],
  remoteContentUrl: null,
  quarantineLength: 14,
  stateAbbreviation: "",
  supportPhoneNumber: null,
  verificationStrategy: "Simple",
}

const ConfigurationContext = createContext<Configuration>(initialState)

export { ConfigurationContext }
