import { useCallback } from "react"
import { Platform, StatusBar, StatusBarStyle } from "react-native"
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation"
import { useFocusEffect } from "@react-navigation/native"

import { ExposureDatum } from "../exposure"

export type NavigationProp = NavigationScreenProp<
  NavigationState,
  NavigationParams
>

export type ActivationStackScreen =
  | "AcceptTermsOfService"
  | "ActivateBluetooth"
  | "ActivateExposureNotifications"
  | "ActivateLocation"
  | "ActivationSummary"
  | "AnonymizedDataConsent"
  | "NotificationPermissions"

export const ActivationStackScreens: {
  [key in ActivationStackScreen]: ActivationStackScreen
} = {
  AcceptTermsOfService: "AcceptTermsOfService",
  ActivateBluetooth: "ActivateBluetooth",
  ActivateExposureNotifications: "ActivateExposureNotifications",
  ActivateLocation: "ActivateLocation",
  ActivationSummary: "ActivationSummary",
  AnonymizedDataConsent: "AnonymizedDataConsent",
  NotificationPermissions: "NotificationPermissions",
}

export type HomeStackScreen =
  | "AffectedUserStack"
  | "BluetoothInfo"
  | "CovidDataDashboard"
  | "ExposureDetectionStatus"
  | "ExposureNotificationsInfo"
  | "Home"
  | "LocationInfo"
  | "EnterSymptoms"
  | "EmergencyRecommendation"
  | "CovidRecommendation"

export const HomeStackScreens: {
  [key in HomeStackScreen]: HomeStackScreen
} = {
  AffectedUserStack: "AffectedUserStack",
  BluetoothInfo: "BluetoothInfo",
  CovidDataDashboard: "CovidDataDashboard",
  ExposureDetectionStatus: "ExposureDetectionStatus",
  ExposureNotificationsInfo: "ExposureNotificationsInfo",
  Home: "Home",
  LocationInfo: "LocationInfo",
  EnterSymptoms: "EnterSymptoms",
  EmergencyRecommendation: "EmergencyRecommendation",
  CovidRecommendation: "CovidRecommendation",
}

export type HowItWorksStackScreen =
  | "Introduction"
  | "PhoneRemembersDevices"
  | "PersonalPrivacy"
  | "GetNotified"
  | "ValueProposition"

export const HowItWorksStackScreens: {
  [key in HowItWorksStackScreen]: HowItWorksStackScreen
} = {
  Introduction: "Introduction",
  PhoneRemembersDevices: "PhoneRemembersDevices",
  PersonalPrivacy: "PersonalPrivacy",
  GetNotified: "GetNotified",
  ValueProposition: "ValueProposition",
}

export type ExposureHistoryStackScreen =
  | "ExposureHistory"
  | "ExposureDetail"
  | "MoreInfo"

export const ExposureHistoryStackScreens: {
  [key in ExposureHistoryStackScreen]: ExposureHistoryStackScreen
} = {
  ExposureHistory: "ExposureHistory",
  ExposureDetail: "ExposureDetail",
  MoreInfo: "MoreInfo",
}

export type ExposureHistoryStackParamList = {
  ExposureDetail: {
    exposureDatum: ExposureDatum
  }
}

export type CallbackStackScreen = "Form" | "Success"

export const CallbackStackScreens: {
  [key in CallbackStackScreen]: CallbackStackScreen
} = {
  Form: "Form",
  Success: "Success",
}

export type ConnectStackScreen = "Connect"

export const ConnectStackScreens: {
  [key in ConnectStackScreen]: ConnectStackScreen
} = {
  Connect: "Connect",
}

export type ModalStackScreen =
  | "LanguageSelection"
  | "ProtectPrivacy"
  | "HowItWorksReviewFromSettings"
  | "HowItWorksReviewFromConnect"
  | "AnonymizedDataConsent"
  | "AtRiskRecommendation"
  | "SelfAssessmentFromExposureDetails"
  | "SelfAssessmentFromHome"
  | "CallbackStack"
  | "AgeVerification"

export const ModalStackScreens: {
  [key in ModalStackScreen]: ModalStackScreen
} = {
  LanguageSelection: "LanguageSelection",
  ProtectPrivacy: "ProtectPrivacy",
  HowItWorksReviewFromSettings: "HowItWorksReviewFromSettings",
  HowItWorksReviewFromConnect: "HowItWorksReviewFromConnect",
  AnonymizedDataConsent: "AnonymizedDataConsent",
  AtRiskRecommendation: "AtRiskRecommendation",
  SelfAssessmentFromExposureDetails: "SelfAssessmentFromExposureDetails",
  SelfAssessmentFromHome: "SelfAssessmentFromHome",
  CallbackStack: "CallbackStack",
  AgeVerification: "AgeVerification",
}

export type SettingsStackScreen =
  | "Settings"
  | "Legal"
  | "DeleteConfirmation"
  | "ENDebugMenu"
  | "ENSubmitDebugForm"
  | "ExposureListDebugScreen"
  | "ENLocalDiagnosisKey"
  | "ProductAnalyticsConsent"

export const SettingsStackScreens: {
  [key in SettingsStackScreen]: SettingsStackScreen
} = {
  Settings: "Settings",
  Legal: "Legal",
  DeleteConfirmation: "DeleteConfirmation",
  ENDebugMenu: "ENDebugMenu",
  ENSubmitDebugForm: "ENSubmitDebugForm",
  ENLocalDiagnosisKey: "ENLocalDiagnosisKey",
  ExposureListDebugScreen: "ExposureListDebugScreen",
  ProductAnalyticsConsent: "ProductAnalyticsConsent",
}

export type AffectedUserFlowStackScreen =
  | "AffectedUserStart"
  | "AffectedUserCodeInput"
  | "AffectedUserPublishConsent"
  | "AffectedUserConfirmUpload"
  | "AffectedUserExportDone"
  | "AffectedUserComplete"

export const AffectedUserFlowStackScreens: {
  [key in AffectedUserFlowStackScreen]: AffectedUserFlowStackScreen
} = {
  AffectedUserStart: "AffectedUserStart",
  AffectedUserCodeInput: "AffectedUserCodeInput",
  AffectedUserPublishConsent: "AffectedUserPublishConsent",
  AffectedUserConfirmUpload: "AffectedUserConfirmUpload",
  AffectedUserExportDone: "AffectedUserExportDone",
  AffectedUserComplete: "AffectedUserComplete",
}

export type WelcomeStackScreen = "Welcome"

export const WelcomeStackScreens: {
  [key in WelcomeStackScreen]: WelcomeStackScreen
} = {
  Welcome: "Welcome",
}

export type SymptomHistoryStackScreen =
  | "SymptomHistory"
  | "SelectSymptoms"
  | "EmergencyRecommendation"
  | "CovidRecommendation"

export const SymptomHistoryStackScreens: {
  [key in SymptomHistoryStackScreen]: SymptomHistoryStackScreen
} = {
  SymptomHistory: "SymptomHistory",
  SelectSymptoms: "SelectSymptoms",
  EmergencyRecommendation: "EmergencyRecommendation",
  CovidRecommendation: "CovidRecommendation",
}

export type SelfAssessmentStackScreen =
  | "SelfAssessmentIntro"
  | "EmergencySymptomsQuestions"
  | "CallEmergencyServices"
  | "GeneralSymptoms"
  | "HowAreYouFeeling"
  | "UnderlyingConditions"
  | "AgeRange"
  | "Guidance"

export const SelfAssessmentStackScreens: {
  [key in SelfAssessmentStackScreen]: SelfAssessmentStackScreen
} = {
  SelfAssessmentIntro: "SelfAssessmentIntro",
  EmergencySymptomsQuestions: "EmergencySymptomsQuestions",
  CallEmergencyServices: "CallEmergencyServices",
  GeneralSymptoms: "GeneralSymptoms",
  HowAreYouFeeling: "HowAreYouFeeling",
  UnderlyingConditions: "UnderlyingConditions",
  AgeRange: "AgeRange",
  Guidance: "Guidance",
}

export type Stack =
  | "Activation"
  | "AffectedUserStack"
  | "Connect"
  | "ExposureHistoryFlow"
  | "HowItWorks"
  | "Settings"
  | "Home"
  | "SymptomHistory"

export const Stacks: { [key in Stack]: Stack } = {
  Activation: "Activation",
  AffectedUserStack: "AffectedUserStack",
  Connect: "Connect",
  ExposureHistoryFlow: "ExposureHistoryFlow",
  HowItWorks: "HowItWorks",
  Settings: "Settings",
  Home: "Home",
  SymptomHistory: "SymptomHistory",
}

export const useStatusBarEffect = (
  statusBarStyle: StatusBarStyle,
  backgroundColor: string,
): void => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(statusBarStyle)
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor(backgroundColor)
      }
    }, [statusBarStyle, backgroundColor]),
  )
}
