import React, { FunctionComponent, createContext, useContext } from "react"
import { Platform } from "react-native"
import env from "react-native-config"

export interface Configuration {
  appDownloadLink: string
  appPackageName: string
  displayAcceptTermsOfService: boolean
  displayCallbackForm: boolean
  displayMyHealth: boolean
  displaySelfScreener: boolean
  emergencyPhoneNumber: string
  findATestCenterUrl: string | null
  healthAuthorityAdviceUrl: string
  healthAuthorityLearnMoreUrl: string
  healthAuthorityEulaUrl: string | null
  healthAuthorityName: string
  healthAuthorityPrivacyPolicyUrl: string
  healthAuthorityLegalPrivacyPolicyUrl: string | null
  healthAuthoritySupportsAnalytics: boolean
  healthAuthorityAnalyticsUrl: string | null
  healthAuthorityAnalyticsSiteId: number | null
  regionCodes: string[]
}

const initialState = {
  appDownloadLink: "",
  appPackageName: "",
  displayAcceptTermsOfService: false,
  displayCallbackForm: false,
  displayMyHealth: false,
  displaySelfScreener: false,
  emergencyPhoneNumber: "",
  findATestCenterUrl: null,
  healthAuthorityAdviceUrl: "",
  healthAuthorityLearnMoreUrl: "",
  healthAuthorityEulaUrl: null,
  healthAuthorityName: "",
  healthAuthorityPrivacyPolicyUrl: "",
  healthAuthorityLegalPrivacyPolicyUrl: "",
  healthAuthoritySupportsAnalytics: false,
  healthAuthorityAnalyticsUrl: null,
  healthAuthorityAnalyticsSiteId: null,
  regionCodes: [],
}

const ConfigurationContext = createContext<Configuration>(initialState)

const ConfigurationProvider: FunctionComponent = ({ children }) => {
  const {
    AUTHORITY_ADVICE_URL: healthAuthorityAdviceUrl,
    FIND_A_TEST_CENTER_URL: findATestCenterUrl,
    EMERGENCY_PHONE_NUMBER: emergencyPhoneNumber,
    EULA_URL: eulaUrl,
    GAEN_AUTHORITY_NAME: healthAuthorityName,
    LEARN_MORE_URL: healthAuthorityLearnMoreUrl,
    LEGAL_PRIVACY_POLICY_URL: legalPrivacyPolicyUrl,
    PRIVACY_POLICY_URL: healthAuthorityPrivacyPolicyUrl,
  } = env
  const displayAcceptTermsOfService =
    env.DISPLAY_ACCEPT_TERMS_OF_SERVICE === "true"
  const displayCallbackForm = env.DISPLAY_CALLBACK_FORM === "true"
  const displayMyHealth = env.DISPLAY_SYMPTOM_CHECKER === "true"
  const displaySelfScreener = env.DISPLAY_SELF_SCREENER === "true"
  const healthAuthoritySupportsAnalytics = Boolean(env.MATOMO_URL)
  const healthAuthorityAnalyticsUrl = env.MATOMO_URL || null
  const healthAuthorityAnalyticsSiteId = parseInt(env.MATOMO_SITE_ID) || null
  const appDownloadLink = env.SHARE_APP_LINK
  const appPackageName = Platform.select({
    ios: env.IOS_BUNDLE_ID,
    android: env.ANDROID_APPLICATION_ID,
  }) as string
  const regionCodes = env.REGION_CODES.split(",")

  return (
    <ConfigurationContext.Provider
      value={{
        appDownloadLink,
        appPackageName,
        displayAcceptTermsOfService,
        displayCallbackForm,
        displayMyHealth,
        displaySelfScreener,
        emergencyPhoneNumber,
        findATestCenterUrl,
        healthAuthorityAdviceUrl,
        healthAuthorityLearnMoreUrl,
        healthAuthorityEulaUrl: eulaUrl || null,
        healthAuthorityName,
        healthAuthorityLegalPrivacyPolicyUrl: legalPrivacyPolicyUrl || null,
        healthAuthorityPrivacyPolicyUrl,
        healthAuthoritySupportsAnalytics,
        healthAuthorityAnalyticsUrl,
        healthAuthorityAnalyticsSiteId,
        regionCodes,
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
