type MeasurementSystem = "Imperial" | "Metric"

export type VerificationStrategy = "Simple" | "Escrow"

export interface Configuration {
  appDownloadUrl: string | null
  appPackageName: string
  cdcGuidanceUrl: string | null
  cdcSymptomsUrl: string | null
  displayAcceptTermsOfService: boolean
  displayAppTransition: boolean
  displayCallbackForm: boolean
  displayRequestCallbackUrl: boolean
  displayCallEmergencyServices: boolean
  displayCovidData: boolean
  displayCovidDataWebView: boolean
  displaySymptomHistory: boolean
  displaySelfAssessment: boolean
  displayAgeVerification: boolean
  enableProductAnalytics: boolean
  emergencyPhoneNumber: string
  externalCovidDataLink: string | null // link to show external covid data link on main page
  externalCovidDataLabel: string // custom label for external covid data, will default to "Covid Data"
  externalTravelGuidanceLink: string | null // link to external travel guidence link on main page
  findATestCenterUrl: string | null
  healthAuthorityAdviceUrl: string
  healthAuthorityCovidDataUrl: string | null
  healthAuthorityCovidDataWebViewUrl: string | null
  healthAuthorityEulaUrl: string | null
  healthAuthorityLearnMoreUrl: string
  healthAuthorityLegalPrivacyPolicyUrl: string | null
  healthAuthorityHealthCheckUrl: string | null
  healthAuthorityPrivacyPolicyUrl: string | null
  healthAuthorityRequestCallbackNumber: string | null
  healthAuthorityVerificationCodeInfoUrl: string | null
  includeSymptomOnsetDate: boolean
  measurementSystem: MeasurementSystem
  minimumAge: string
  minimumPhoneDigits: number
  quarantineLength: number
  regionCodes: string[]
  remoteContentUrl: string | null
  stateAbbreviation: string | null
  supportPhoneNumber: string | null
  verificationStrategy: VerificationStrategy
}
