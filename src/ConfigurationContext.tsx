import React, { FunctionComponent, createContext, useContext } from "react"
import { Platform } from "react-native"
import env from "react-native-config"

type MeasurementSystem = "Imperial" | "Metric"

export interface Configuration {
  appDownloadLink: string
  appPackageName: string
  displayAcceptTermsOfService: boolean
  displayCallbackForm: boolean
  displayCovidData: boolean
  displaySymptomHistory: boolean
  displaySelfAssessment: boolean
  emergencyPhoneNumber: string
  findATestCenterUrl: string | null
  healthAuthorityAdviceUrl: string
  healthAuthorityAnalyticsSiteId: number | null
  healthAuthorityAnalyticsUrl: string | null
  healthAuthorityEulaUrl: string | null
  healthAuthorityLearnMoreUrl: string
  healthAuthorityLegalPrivacyPolicyUrl: string | null
  healthAuthorityName: string
  healthAuthorityPrivacyPolicyUrl: string
  healthAuthoritySupportsAnalytics: boolean
  measurementSystem: MeasurementSystem
  regionCodes: string[]
  stateAbbreviation: string | null
}

const initialState: Configuration = {
  appDownloadLink: "",
  appPackageName: "",
  displayAcceptTermsOfService: false,
  displayCallbackForm: false,
  displayCovidData: false,
  displaySymptomHistory: false,
  displaySelfAssessment: false,
  emergencyPhoneNumber: "",
  findATestCenterUrl: null,
  healthAuthorityAdviceUrl: "",
  healthAuthorityAnalyticsSiteId: null,
  healthAuthorityAnalyticsUrl: null,
  healthAuthorityEulaUrl: null,
  healthAuthorityLearnMoreUrl: "",
  healthAuthorityLegalPrivacyPolicyUrl: "",
  healthAuthorityName: "",
  healthAuthorityPrivacyPolicyUrl: "",
  healthAuthoritySupportsAnalytics: false,
  measurementSystem: "Imperial" as const,
  regionCodes: [],
  stateAbbreviation: "",
}

const ConfigurationContext = createContext<Configuration>(initialState)

const ConfigurationProvider: FunctionComponent = ({ children }) => {
  const {
    AUTHORITY_ADVICE_URL: healthAuthorityAdviceUrl,
    EMERGENCY_PHONE_NUMBER: emergencyPhoneNumber,
    EULA_URL: eulaUrl,
    FIND_A_TEST_CENTER_URL: findATestCenterUrl,
    GAEN_AUTHORITY_NAME: healthAuthorityName,
    LEARN_MORE_URL: healthAuthorityLearnMoreUrl,
    LEGAL_PRIVACY_POLICY_URL: legalPrivacyPolicyUrl,
    PRIVACY_POLICY_URL: healthAuthorityPrivacyPolicyUrl,
  } = env

  const displayAcceptTermsOfService =
    env.DISPLAY_ACCEPT_TERMS_OF_SERVICE === "true"
  const displayCallbackForm = env.DISPLAY_CALLBACK_FORM === "true"
  const displayCovidData = env.DISPLAY_COVID_DATA === "true"
  const displaySymptomHistory = env.DISPLAY_SYMPTOM_HISTORY === "true"
  const displaySelfAssessment = env.DISPLAY_SELF_ASSESSMENT === "true"

  const measurementSystem =
    env.MEASUREMENT_SYSTEM === "metric" ? "Metric" : "Imperial"

  const healthAuthoritySupportsAnalytics = Boolean(env.MATOMO_URL)
  const healthAuthorityAnalyticsUrl = env.MATOMO_URL || null
  const healthAuthorityAnalyticsSiteId = parseInt(env.MATOMO_SITE_ID) || null

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
        displayCovidData,
        displaySymptomHistory,
        displaySelfAssessment,
        emergencyPhoneNumber,
        findATestCenterUrl,
        healthAuthorityAdviceUrl,
        healthAuthorityAnalyticsSiteId,
        healthAuthorityAnalyticsUrl,
        healthAuthorityEulaUrl: eulaUrl || null,
        healthAuthorityLearnMoreUrl,
        healthAuthorityLegalPrivacyPolicyUrl: legalPrivacyPolicyUrl || null,
        healthAuthorityName,
        healthAuthorityPrivacyPolicyUrl,
        healthAuthoritySupportsAnalytics,
        measurementSystem,
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
