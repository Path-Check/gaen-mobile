import React, { FunctionComponent, createContext, useContext } from "react"
import { Platform } from "react-native"
import env from "react-native-config"

type MeasurementSystem = "Imperial" | "Metric"

export interface Configuration {
  appDownloadLink: string
  appPackageName: string
  displayAcceptTermsOfService: boolean
  displayCallbackForm: boolean
  displayCallEmergencyServices: boolean
  displayCovidData: boolean
  displaySymptomHistory: boolean
  displaySelfAssessment: boolean
  displayAgeVerification: boolean
  enableProductAnalytics: boolean
  emergencyPhoneNumber: string
  findATestCenterUrl: string | null
  healthAuthorityAdviceUrl: string
  healthAuthorityCovidDataUrl: string | null
  healthAuthorityEulaUrl: string | null
  healthAuthorityLearnMoreUrl: string
  healthAuthorityLegalPrivacyPolicyUrl: string | null
  healthAuthorityPrivacyPolicyUrl: string
  measurementSystem: MeasurementSystem
  minimumAge: string
  regionCodes: string[]
  stateAbbreviation: string | null
}

const initialState: Configuration = {
  appDownloadLink: "",
  appPackageName: "",
  displayAcceptTermsOfService: false,
  displayCallbackForm: false,
  displayCallEmergencyServices: false,
  displayCovidData: false,
  displaySymptomHistory: false,
  displaySelfAssessment: false,
  displayAgeVerification: false,
  emergencyPhoneNumber: "",
  enableProductAnalytics: false,
  findATestCenterUrl: null,
  healthAuthorityAdviceUrl: "",
  healthAuthorityCovidDataUrl: null,
  healthAuthorityEulaUrl: null,
  healthAuthorityLearnMoreUrl: "",
  healthAuthorityLegalPrivacyPolicyUrl: "",
  healthAuthorityPrivacyPolicyUrl: "",
  measurementSystem: "Imperial" as const,
  minimumAge: "18",
  regionCodes: [],
  stateAbbreviation: "",
}

const ConfigurationContext = createContext<Configuration>(initialState)

const ConfigurationProvider: FunctionComponent = ({ children }) => {
  const {
    AUTHORITY_ADVICE_URL: healthAuthorityAdviceUrl,
    AUTHORITY_COVID_DATA_URL: healthAuthorityCovidDataUrl,
    EMERGENCY_PHONE_NUMBER: emergencyPhoneNumber,
    EULA_URL: eulaUrl,
    FIND_A_TEST_CENTER_URL: findATestCenterUrl,
    LEARN_MORE_URL: healthAuthorityLearnMoreUrl,
    LEGAL_PRIVACY_POLICY_URL: legalPrivacyPolicyUrl,
    PRIVACY_POLICY_URL: healthAuthorityPrivacyPolicyUrl,
  } = env

  const displayAcceptTermsOfService =
    env.DISPLAY_ACCEPT_TERMS_OF_SERVICE === "true"
  const displayCallbackForm = env.DISPLAY_CALLBACK_FORM === "true"
  const displayCallEmergencyServices =
    env.DISPLAY_CALL_EMERGENCY_SERVICES === "true"
  const displayCovidData = env.DISPLAY_COVID_DATA === "true"
  const displaySymptomHistory = env.DISPLAY_SYMPTOM_HISTORY === "true"
  const displaySelfAssessment = env.DISPLAY_SELF_ASSESSMENT === "true"
  const displayAgeVerification = env.DISPLAY_AGE_VERIFICATION === "true"
  const enableProductAnalytics = env.ENABLE_PRODUCT_ANALYTICS === "true"

  const measurementSystem =
    env.MEASUREMENT_SYSTEM === "metric" ? "Metric" : "Imperial"

  const minimumAge = env.MINIMUM_AGE

  const appDownloadLink = env.SHARE_APP_LINK
  const appPackageName = Platform.select({
    ios: env.IOS_BUNDLE_ID,
    android: env.ANDROID_APPLICATION_ID,
  }) as string
  const regionCodes = env.REGION_CODES.split(",")

  const stateAbbreviation =
    env.STATE_ABBREVIATION?.length > 0 ? env.STATE_ABBREVIATION : null

  return (
    <ConfigurationContext.Provider
      value={{
        appDownloadLink,
        appPackageName,
        displayAcceptTermsOfService,
        displayCallbackForm,
        displayCallEmergencyServices,
        displayCovidData,
        displaySymptomHistory,
        displaySelfAssessment,
        displayAgeVerification,
        enableProductAnalytics,
        emergencyPhoneNumber,
        findATestCenterUrl,
        healthAuthorityAdviceUrl,
        healthAuthorityCovidDataUrl,
        healthAuthorityEulaUrl: eulaUrl || null,
        healthAuthorityLearnMoreUrl,
        healthAuthorityLegalPrivacyPolicyUrl: legalPrivacyPolicyUrl || null,
        healthAuthorityPrivacyPolicyUrl,
        measurementSystem,
        minimumAge,
        regionCodes,
        stateAbbreviation,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  )
}

const useConfigurationContext = (): Configuration => {
  const context = useContext(ConfigurationContext)
  if (context === undefined) {
    throw new Error("ConfigurationContext must be used with a provider")
  }
  return context
}

export { ConfigurationContext, ConfigurationProvider, useConfigurationContext }
