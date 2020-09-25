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

export type ActivationScreen =
  | "AcceptTermsOfService"
  | "ActivateProximityTracing"
  | "ActivateLocation"
  | "NotificationPermissions"
  | "ActivationSummary"

export const ActivationScreens: {
  [key in ActivationScreen]: ActivationScreen
} = {
  AcceptTermsOfService: "AcceptTermsOfService",
  ActivateProximityTracing: "ActivateProximityTracing",
  ActivateLocation: "ActivateLocation",
  NotificationPermissions: "NotificationPermissions",
  ActivationSummary: "ActivationSummary",
}

export type HomeScreen =
  | "Home"
  | "BluetoothInfo"
  | "ProximityTracingInfo"
  | "LocationInfo"

export const HomeScreens: {
  [key in HomeScreen]: HomeScreen
} = {
  Home: "Home",
  BluetoothInfo: "BluetoothInfo",
  ProximityTracingInfo: "ProximityTracingInfo",
  LocationInfo: "LocationInfo",
}

export type HowItWorksScreen =
  | "Introduction"
  | "PhoneRemembersDevices"
  | "PersonalPrivacy"
  | "GetNotified"
  | "ValueProposition"

export const HowItWorksScreens: {
  [key in HowItWorksScreen]: HowItWorksScreen
} = {
  Introduction: "Introduction",
  PhoneRemembersDevices: "PhoneRemembersDevices",
  PersonalPrivacy: "PersonalPrivacy",
  GetNotified: "GetNotified",
  ValueProposition: "ValueProposition",
}

export type ExposureHistoryScreen =
  | "ExposureHistory"
  | "ExposureDetail"
  | "MoreInfo"

export const ExposureHistoryScreens: {
  [key in ExposureHistoryScreen]: ExposureHistoryScreen
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

export type ModalScreen =
  | "LanguageSelection"
  | "ProtectPrivacy"
  | "AffectedUserStack"
  | "HowItWorksReviewFromSettings"
  | "HowItWorksReviewFromConnect"
  | "AnonymizedDataConsent"
  | "AtRiskRecommendation"

export const ModalScreens: {
  [key in ModalScreen]: ModalScreen
} = {
  LanguageSelection: "LanguageSelection",
  ProtectPrivacy: "ProtectPrivacy",
  AffectedUserStack: "AffectedUserStack",
  HowItWorksReviewFromSettings: "HowItWorksReviewFromSettings",
  HowItWorksReviewFromConnect: "HowItWorksReviewFromConnect",
  AnonymizedDataConsent: "AnonymizedDataConsent",
  AtRiskRecommendation: "AtRiskRecommendation",
}

export type SettingsScreen =
  | "Settings"
  | "Legal"
  | "ENDebugMenu"
  | "ENSubmitDebugForm"
  | "ExposureListDebugScreen"
  | "ENLocalDiagnosisKey"

export const SettingsScreens: {
  [key in SettingsScreen]: SettingsScreen
} = {
  Settings: "Settings",
  Legal: "Legal",
  ENDebugMenu: "ENDebugMenu",
  ENSubmitDebugForm: "ENSubmitDebugForm",
  ENLocalDiagnosisKey: "ENLocalDiagnosisKey",
  ExposureListDebugScreen: "ExposureListDebugScreen",
}

export type AffectedUserFlowScreen =
  | "AffectedUserStart"
  | "AffectedUserCodeInput"
  | "AffectedUserPublishConsent"
  | "AffectedUserConfirmUpload"
  | "AffectedUserExportDone"
  | "AffectedUserComplete"

export const AffectedUserFlowScreens: {
  [key in AffectedUserFlowScreen]: AffectedUserFlowScreen
} = {
  AffectedUserStart: "AffectedUserStart",
  AffectedUserCodeInput: "AffectedUserCodeInput",
  AffectedUserPublishConsent: "AffectedUserPublishConsent",
  AffectedUserConfirmUpload: "AffectedUserConfirmUpload",
  AffectedUserExportDone: "AffectedUserExportDone",
  AffectedUserComplete: "AffectedUserComplete",
}

export type WelcomeScreen = "Welcome"

export const WelcomeScreens: { [key in WelcomeScreen]: WelcomeScreen } = {
  Welcome: "Welcome",
}

export type MyHealthStackScreen = "MyHealth" | "SelectSymptoms"

export const MyHealthStackScreens: {
  [key in MyHealthStackScreen]: MyHealthStackScreen
} = {
  MyHealth: "MyHealth",
  SelectSymptoms: "SelectSymptoms",
}

export type Stack =
  | "Activation"
  | "AffectedUserStack"
  | "Callback"
  | "Connect"
  | "ExposureHistoryFlow"
  | "Modal"
  | "HowItWorks"
  | "HowItWorksReviewFromSettings"
  | "HowItWorksReviewFromConnect"
  | "Settings"
  | "Home"
  | "MyHealth"

export const Stacks: { [key in Stack]: Stack } = {
  Activation: "Activation",
  AffectedUserStack: "AffectedUserStack",
  Callback: "Callback",
  Connect: "Connect",
  ExposureHistoryFlow: "ExposureHistoryFlow",
  Modal: "Modal",
  HowItWorks: "HowItWorks",
  HowItWorksReviewFromSettings: "HowItWorksReviewFromSettings",
  HowItWorksReviewFromConnect: "HowItWorksReviewFromConnect",
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
