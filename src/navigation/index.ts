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
  | "ActivateExposureNotifications"
  | "ActivateLocation"
  | "NotificationPermissions"
  | "ActivationSummary"

export const ActivationStackScreens: {
  [key in ActivationStackScreen]: ActivationStackScreen
} = {
  AcceptTermsOfService: "AcceptTermsOfService",
  ActivateExposureNotifications: "ActivateExposureNotifications",
  ActivateLocation: "ActivateLocation",
  NotificationPermissions: "NotificationPermissions",
  ActivationSummary: "ActivationSummary",
}

export type HomeStackScreen =
  | "Home"
  | "BluetoothInfo"
  | "ExposureNotificationsInfo"
  | "LocationInfo"
  | "ExposureDetectionStatus"
  | "AffectedUserStack"

export const HomeStackScreens: {
  [key in HomeStackScreen]: HomeStackScreen
} = {
  Home: "Home",
  BluetoothInfo: "BluetoothInfo",
  ExposureNotificationsInfo: "ExposureNotificationsInfo",
  LocationInfo: "LocationInfo",
  ExposureDetectionStatus: "ExposureDetectionStatus",
  AffectedUserStack: "AffectedUserStack",
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
  | "SelfScreenerFromExposureDetails"
  | "SelfScreenerFromHome"
  | "CallbackStack"

export const ModalStackScreens: {
  [key in ModalStackScreen]: ModalStackScreen
} = {
  LanguageSelection: "LanguageSelection",
  ProtectPrivacy: "ProtectPrivacy",
  HowItWorksReviewFromSettings: "HowItWorksReviewFromSettings",
  HowItWorksReviewFromConnect: "HowItWorksReviewFromConnect",
  AnonymizedDataConsent: "AnonymizedDataConsent",
  AtRiskRecommendation: "AtRiskRecommendation",
  SelfScreenerFromExposureDetails: "SelfScreenerFromExposureDetails",
  SelfScreenerFromHome: "SelfScreenerFromHome",
  CallbackStack: "CallbackStack",
}

export type SettingsStackScreen =
  | "Settings"
  | "Legal"
  | "ENDebugMenu"
  | "ENSubmitDebugForm"
  | "ExposureListDebugScreen"
  | "ENLocalDiagnosisKey"

export const SettingsStackScreens: {
  [key in SettingsStackScreen]: SettingsStackScreen
} = {
  Settings: "Settings",
  Legal: "Legal",
  ENDebugMenu: "ENDebugMenu",
  ENSubmitDebugForm: "ENSubmitDebugForm",
  ENLocalDiagnosisKey: "ENLocalDiagnosisKey",
  ExposureListDebugScreen: "ExposureListDebugScreen",
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

export type MyHealthStackScreen = "MyHealth" | "SelectSymptoms"

export const MyHealthStackScreens: {
  [key in MyHealthStackScreen]: MyHealthStackScreen
} = {
  MyHealth: "MyHealth",
  SelectSymptoms: "SelectSymptoms",
}

export type SelfScreenerStackScreen =
  | "SelfScreenerIntro"
  | "EmergencySymptomsQuestions"
  | "CallEmergencyServices"
  | "GeneralSymptoms"
  | "HowAreYouFeeling"
  | "UnderlyingConditions"
  | "AgeRange"
  | "Guidance"

export const SelfScreenerStackScreens: {
  [key in SelfScreenerStackScreen]: SelfScreenerStackScreen
} = {
  SelfScreenerIntro: "SelfScreenerIntro",
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
  | "Modal"
  | "HowItWorks"
  | "Settings"
  | "Home"
  | "MyHealth"

export const Stacks: { [key in Stack]: Stack } = {
  Activation: "Activation",
  AffectedUserStack: "AffectedUserStack",
  Connect: "Connect",
  ExposureHistoryFlow: "ExposureHistoryFlow",
  Modal: "Modal",
  HowItWorks: "HowItWorks",
  Settings: "Settings",
  Home: "Home",
  MyHealth: "MyHealth",
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
