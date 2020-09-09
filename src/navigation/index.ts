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
  | "ProtectPrivacy"

export const OnboardingScreens: {
  [key in OnboardingScreen]: OnboardingScreen
} = {
  Welcome: "Welcome",
  Introduction: "Introduction",
  PhoneRemembersDevices: "PhoneRemembersDevices",
  PersonalPrivacy: "PersonalPrivacy",
  GetNotified: "GetNotified",
  ValueProposition: "ValueProposition",
  ProtectPrivacy: "ProtectPrivacy",
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

export type ReportIssueScreen = "ReportIssueForm"

export const ReportIssueScreens: {
  [key in ReportIssueScreen]: ReportIssueScreen
} = {
  ReportIssueForm: "ReportIssueForm",
}

export type ConnectStackScreen = "Connect"

export const ConnectStackScreens: {
  [key in ConnectStackScreen]: ConnectStackScreen
} = {
  Connect: "Connect",
}

export type SettingsScreen =
  | "Menu"
  | "About"
  | "Legal"
  | "ENDebugMenu"
  | "ENSubmitDebugForm"
  | "AffectedUserFlow"
  | "ExposureListDebugScreen"
  | "ENLocalDiagnosisKey"

export const SettingsScreens: {
  [key in SettingsScreen]: SettingsScreen
} = {
  Menu: "Menu",
  About: "About",
  Legal: "Legal",
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
  | "ProtectPrivacy"

export const AffectedUserFlowScreens: {
  [key in AffectedUserFlowScreen]: AffectedUserFlowScreen
} = {
  AffectedUserStart: "AffectedUserStart",
  AffectedUserCodeInput: "AffectedUserCodeInput",
  AffectedUserPublishConsent: "AffectedUserPublishConsent",
  AffectedUserConfirmUpload: "AffectedUserConfirmUpload",
  AffectedUserExportDone: "AffectedUserExportDone",
  AffectedUserComplete: "AffectedUserComplete",
  ProtectPrivacy: "ProtectPrivacy",
}
export type Screen =
  | OnboardingScreen
  | ExposureHistoryScreen
  | ReportIssueScreen
  | SettingsScreen
  | SelfAssessmentScreen
  | AffectedUserFlowScreen
  | HomeScreen
  | "ReportIssueForm"
  | "LanguageSelection"

export const Screens: { [key in Screen]: Screen } = {
  ...OnboardingScreens,
  ...ExposureHistoryScreens,
  ...ReportIssueScreens,
  ...SettingsScreens,
  ...SelfAssessmentScreens,
  ...AffectedUserFlowScreens,
  ...HomeScreens,
  ReportIssueForm: "ReportIssueForm",
  LanguageSelection: "LanguageSelection",
}

export type Stack =
  | "Activation"
  | "AffectedUserStack"
  | "Connect"
  | "ExposureHistoryFlow"
  | "Onboarding"
  | "Settings"

export const Stacks: { [key in Stack]: Stack } = {
  Activation: "Activation",
  AffectedUserStack: "AffectedUserStack",
  Connect: "Connect",
  ExposureHistoryFlow: "ExposureHistoryFlow",
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
