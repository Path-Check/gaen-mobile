import React, { FunctionComponent } from "react"
import { Platform } from "react-native"
import env from "react-native-config"
import { VerificationStrategy } from "./configurationInterface"
import { ConfigurationContext } from "./configurationContext"

const toVerificationStrategy = (strategy: string): VerificationStrategy => {
  switch (strategy) {
    case "simple":
      return "Simple"
    case "escrow":
      return "Escrow"
    default:
      return "Simple"
  }
}

const DEFAULT_QUARANTINE_LENGTH = 14

const ConfigurationProvider: FunctionComponent = ({ children }) => {
  const {
    AUTHORITY_ADVICE_URL: healthAuthorityAdviceUrl,
    EMERGENCY_PHONE_NUMBER: emergencyPhoneNumber,
    FIND_A_TEST_CENTER_URL: findATestCenterUrl,
    LEARN_MORE_URL: healthAuthorityLearnMoreUrl,
    PRIVACY_POLICY_URL: healthAuthorityPrivacyPolicyUrl,
  } = env

  const appDownloadUrl = env.SHARE_APP_LINK || null
  const cdcGuidanceUrl = env.CDC_GUIDANCE_LINK || null
  const cdcSymptomsUrl = env.CDC_SYMPTOMS_URL || null
  const healthAuthorityCovidDataUrl = env.AUTHORITY_COVID_DATA_URL || null
  const healthAuthorityCovidDataWebViewUrl =
    env.AUTHORITY_COVID_DATA_WEBVIEW_URL || null
  const healthAuthorityEulaUrl = env.EULA_URL || null
  const healthAuthorityHealthCheckUrl = env.HEALTH_CHECK_URL || null
  const healthAuthorityLegalPrivacyPolicyUrl =
    env.LEGAL_PRIVACY_POLICY_URL || null
  const healthAuthorityVerificationCodeInfoUrl =
    env.VERIFICATION_CODE_INFO_URL || null
  const remoteContentUrl = env.REMOTE_CONTENT_URL || null
  const healthAuthorityRequestCallbackNumber =
    env.HEALTH_AUTHORITY_REQUEST_CALLBACK_NUMBER || null
  const supportPhoneNumber = env.SUPPORT_PHONE_NUMBER || null

  const displayAcceptTermsOfService =
    env.DISPLAY_ACCEPT_TERMS_OF_SERVICE === "true"
  const displayAppTransition = env.DISPLAY_APP_TRANSITION === "true"
  const displayCallbackForm = env.DISPLAY_CALLBACK_FORM === "true"
  const displayRequestCallbackUrl = env.DISPLAY_REQUEST_CALLBACK_URL === "true"
  const displayCallEmergencyServices =
    env.DISPLAY_CALL_EMERGENCY_SERVICES === "true"
  const displayCovidData = env.DISPLAY_COVID_DATA === "true"
  const displayCovidDataWebView = env.DISPLAY_COVID_DATA_WEBVIEW === "true"
  const displaySymptomHistory = env.DISPLAY_SYMPTOM_HISTORY === "true"
  const displaySelfAssessment = env.DISPLAY_SELF_ASSESSMENT === "true"
  const displayAgeVerification = env.DISPLAY_AGE_VERIFICATION === "true"

  const enableProductAnalytics = env.ENABLE_PRODUCT_ANALYTICS === "true"

  const includeSymptomOnsetDate = env.INCLUDE_SYMPTOM_ONSET_DATE === "true"

  const measurementSystem =
    env.MEASUREMENT_SYSTEM === "metric" ? "Metric" : "Imperial"

  const minimumAge = env.MINIMUM_AGE
  const minimumPhoneDigits = parseInt(env.MINIMUM_PHONE_DIGITS) || 0

  const appPackageName = Platform.select({
    ios: env.IOS_BUNDLE_ID,
    android: env.ANDROID_APPLICATION_ID,
  }) as string
  const regionCodes = env.REGION_CODES.split(",")

  const stateAbbreviation =
    env.STATE_ABBREVIATION?.length > 0 ? env.STATE_ABBREVIATION : null

  const verificationStrategy: VerificationStrategy = toVerificationStrategy(
    env.VERIFICATION_STRATEGY,
  )

  const envQuarantineLength = Number(env.QUARANTINE_LENGTH)
  const quarantineLength = isNaN(envQuarantineLength)
    ? DEFAULT_QUARANTINE_LENGTH
    : envQuarantineLength

  //Added for LA
  const externalCovidDataLink = env.EXTERNAL_COVID_DATA_LINK || null
  const externalCovidDataLabel =
    env.EXTERNAL_COVID_DATA_LABEL || "home.covid_data"
  const externalTravelGuidanceLink = env.EXTERNAL_TRAVEL_GUIDANCE_LINK || null

  //Added for MN
  const displayQuarantineRecommendation = env.DISPLAY_QUARANTINE_RECOMMENDATION === "true"

  return (
    <ConfigurationContext.Provider
      value={{
        appDownloadUrl,
        cdcGuidanceUrl,
        cdcSymptomsUrl,
        appPackageName,
        displayAcceptTermsOfService,
        displayAppTransition,
        displayCallbackForm,
        displayRequestCallbackUrl,
        displayCallEmergencyServices,
        displayCovidData,
        displayCovidDataWebView,
        displayQuarantineRecommendation,
        displaySymptomHistory,
        displaySelfAssessment,
        displayAgeVerification,
        enableProductAnalytics,
        emergencyPhoneNumber,
        externalCovidDataLabel,
        externalCovidDataLink,
        externalTravelGuidanceLink,
        findATestCenterUrl,
        healthAuthorityAdviceUrl,
        healthAuthorityCovidDataUrl,
        healthAuthorityCovidDataWebViewUrl,
        healthAuthorityEulaUrl,
        healthAuthorityHealthCheckUrl,
        healthAuthorityLearnMoreUrl,
        healthAuthorityLegalPrivacyPolicyUrl,
        healthAuthorityPrivacyPolicyUrl,
        healthAuthorityRequestCallbackNumber,
        healthAuthorityVerificationCodeInfoUrl,
        includeSymptomOnsetDate,
        measurementSystem,
        minimumAge,
        minimumPhoneDigits,
        quarantineLength,
        regionCodes,
        remoteContentUrl,
        stateAbbreviation,
        supportPhoneNumber,
        verificationStrategy,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  )
}

export { ConfigurationProvider }
