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

export type OnboardingScreen =
  | "Welcome"
  | "Introduction"
  | "PhoneRemembersDevices"
  | "PersonalPrivacy"
  | "GetNotified"
  | "ValueProposition"

export const OnboardingScreens: {
  [key in OnboardingScreen]: OnboardingScreen
} = {
  Welcome: "Welcome",
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

export const ModalScreens: {
  [key in ModalScreen]: ModalScreen
} = {
  LanguageSelection: "LanguageSelection",
  ProtectPrivacy: "ProtectPrivacy",
  AffectedUserStack: "AffectedUserStack",
}

export type SettingsScreen =
  | "Settings"
  | "About"
  | "Legal"
  | "AffectedUserFlow"
  | "CallbackForm"
  | "ReportIssue"
  | "ENDebugMenu"
  | "ENSubmitDebugForm"
  | "ExposureListDebugScreen"
  | "ENLocalDiagnosisKey"

export const SettingsScreens: {
  [key in SettingsScreen]: SettingsScreen
} = {
  Settings: "Settings",
  About: "About",
  Legal: "Legal",
  CallbackForm: "CallbackForm",
  ReportIssue: "ReportIssue",
  ENDebugMenu: "ENDebugMenu",
  ENSubmitDebugForm: "ENSubmitDebugForm",
  AffectedUserFlow: "AffectedUserFlow",
  ENLocalDiagnosisKey: "ENLocalDiagnosisKey",
  ExposureListDebugScreen: "ExposureListDebugScreen",
}

export type SelfAssessmentScreen = "SelfAssessment"

export const SelfAssessmentScreens: {
  [key in SelfAssessmentScreen]: SelfAssessmentScreen
} = {
  SelfAssessment: "SelfAssessment",
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
export type Screen =
  | OnboardingScreen
  | ExposureHistoryScreen
  | SettingsScreen
  | SelfAssessmentScreen
  | AffectedUserFlowScreen
  | HomeScreen
  | "LanguageSelection"

export const Screens: { [key in Screen]: Screen } = {
  ...OnboardingScreens,
  ...ExposureHistoryScreens,
  ...SettingsScreens,
  ...SelfAssessmentScreens,
  ...AffectedUserFlowScreens,
  ...HomeScreens,
  LanguageSelection: "LanguageSelection",
}

export type Stack =
  | "Activation"
  | "AffectedUserStack"
  | "Connect"
  | "ExposureHistoryFlow"
  | "Modal"
  | "Onboarding"
  | "Settings"

export const Stacks: { [key in Stack]: Stack } = {
  Activation: "Activation",
  AffectedUserStack: "AffectedUserStack",
  Connect: "Connect",
  ExposureHistoryFlow: "ExposureHistoryFlow",
  Modal: "Modal",
  Onboarding: "Onboarding",
  Settings: "Settings",
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
