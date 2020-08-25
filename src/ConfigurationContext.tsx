import React, { FunctionComponent, createContext, useContext } from "react"
import { Platform } from "react-native"
import env from "react-native-config"

export interface Configuration {
  appDownloadLink: string
  appPackageName: string
  displayReportAnIssue: boolean
  displaySelfAssessment: boolean
  healthAuthorityAdviceUrl: string
  healthAuthorityName: string
  healthAuthorityPrivacyPolicyUrl: string
  regionCodes: string[]
}

const initialState = {
  appDownloadLink: "",
  appPackageName: "",
  displayReportAnIssue: false,
  displaySelfAssessment: false,
  healthAuthorityAdviceUrl: "",
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
  } = env
  const displaySelfAssessment = env.DISPLAY_SELF_ASSESSMENT === "true"
  const displayReportAnIssue = env.DISPLAY_REPORT_AN_ISSUE === "true"
  const appDownloadLink = Platform.select({
    ios: env.IOS_APP_STORE_URL,
    android: env.ANDROID_PLAY_STORE_URL,
  }) as string
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
        displayReportAnIssue,
        displaySelfAssessment,
        healthAuthorityAdviceUrl,
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
