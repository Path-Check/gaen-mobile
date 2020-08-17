import { useCallback } from "react"
import { Platform, StatusBar } from "react-native"
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation"
import { useFocusEffect } from "@react-navigation/native"

import { ExposureDatum } from "../exposure"

import { Colors } from "../styles"

export type NavigationProp = NavigationScreenProp<
  NavigationState,
  NavigationParams
>

export type ActivationScreen =
  | "AcceptEula"
  | "ActivateProximityTracing"
  | "NotificationPermissions"

export const ActivationScreens: {
  [key in ActivationScreen]: ActivationScreen
} = {
  AcceptEula: "AcceptEula",
  ActivateProximityTracing: "ActivateProximityTracing",
  NotificationPermissions: "NotificationPermissions",
}

export type HomeScreen = "Home" | "BluetoothInfo" | "ProximityTracingInfo"

export const HomeScreens: {
  [key in HomeScreen]: HomeScreen
} = {
  Home: "Home",
  BluetoothInfo: "BluetoothInfo",
  ProximityTracingInfo: "ProximityTracingInfo",
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

export type MoreStackScreen =
  | "Menu"
  | "About"
  | "Licenses"
  | "ENDebugMenu"
  | "ENSubmitDebugForm"
  | "AffectedUserFlow"
  | "ExposureListDebugScreen"
  | "ENLocalDiagnosisKey"

export const MoreStackScreens: {
  [key in MoreStackScreen]: MoreStackScreen
} = {
  Menu: "Menu",
  About: "About",
  Licenses: "Licenses",
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
  | MoreStackScreen
  | SelfAssessmentScreen
  | AffectedUserFlowScreen
  | HomeScreen
  | "ReportIssueForm"
  | "LanguageSelection"

export const Screens: { [key in Screen]: Screen } = {
  ...OnboardingScreens,
  ...ExposureHistoryScreens,
  ...ReportIssueScreens,
  ...MoreStackScreens,
  ...SelfAssessmentScreens,
  ...AffectedUserFlowScreens,
  ...HomeScreens,
  ReportIssueForm: "ReportIssueForm",
  LanguageSelection: "LanguageSelection",
}

export type Stack =
  | "Activation"
  | "Onboarding"
  | "ExposureHistoryFlow"
  | "SelfAssessment"
  | "More"
  | "AffectedUserStack"
  | "ReportIssue"

export const Stacks: { [key in Stack]: Stack } = {
  Activation: "Activation",
  Onboarding: "Onboarding",
  ExposureHistoryFlow: "ExposureHistoryFlow",
  SelfAssessment: "SelfAssessment",
  More: "More",
  AffectedUserStack: "AffectedUserStack",
  ReportIssue: "ReportIssue",
}

export type StatusBarStyle = "dark-content" | "light-content"

export const useStatusBarEffect = (statusBarStyle: StatusBarStyle): void => {
  const backgroundColor =
    statusBarStyle === "dark-content"
      ? Colors.primaryBackground
      : Colors.primaryViolet

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(statusBarStyle)
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor(backgroundColor)
        StatusBar.setTranslucent(true)
      }
    }, [statusBarStyle, backgroundColor]),
  )
}
