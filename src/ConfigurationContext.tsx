import React, { FunctionComponent, createContext, useContext } from "react"
import { Platform } from "react-native"
import env from "react-native-config"

export interface Configuration {
  appDownloadLink: string
  appPackageName: string
  displayAcceptTermsOfService: boolean
  displayReportAnIssue: boolean
  displaySelfAssessment: boolean
  healthAuthorityAdviceUrl: string
  healthAuthorityEulaUrl: string | null
  healthAuthorityName: string
  healthAuthorityPrivacyPolicyUrl: string
  regionCodes: string[]
}

const initialState = {
  appDownloadLink: "",
  appPackageName: "",
  displayAcceptTermsOfService: false,
  displayReportAnIssue: false,
  displaySelfAssessment: false,
  healthAuthorityAdviceUrl: "",
  healthAuthorityEulaUrl: null,
  healthAuthorityName: "",
  healthAuthorityPrivacyPolicyUrl: "",
  regionCodes: [],
}

const ConfigurationContext = createContext<Configuration>(initialState)

const ConfigurationProvider: FunctionComponent = ({ children }) => {
  const {
    AUTHORITY_ADVICE_URL: healthAuthorityAdviceUrl,
    GAEN_AUTHORITY_NAME: healthAuthorityName,
    PRIVACY_POLICY_URL: healthAuthorityPrivacyPolicyUrl,
    EULA_URL: eulaUrl,
  } = env
  const displayAcceptTermsOfService =
    env.DISPLAY_ACCEPT_TERMS_OF_SERVICE === "true"
  const displaySelfAssessment = env.DISPLAY_SELF_ASSESSMENT === "true"
  const displayReportAnIssue = env.DISPLAY_REPORT_AN_ISSUE === "true"
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
        displayReportAnIssue,
        displaySelfAssessment,
        healthAuthorityAdviceUrl,
        healthAuthorityEulaUrl: eulaUrl || null,
        healthAuthorityName,
        healthAuthorityPrivacyPolicyUrl,
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
