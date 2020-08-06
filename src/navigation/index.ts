import { useCallback } from "react"
import { Platform, StatusBar } from "react-native"
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
  | "NotificationPermissions"
  | "ActivateProximityTracing"

export const ActivationScreens: {
  [key in ActivationScreen]: ActivationScreen
} = {
  NotificationPermissions: "NotificationPermissions",
  ActivateProximityTracing: "ActivateProximityTracing",
}

export type OnboardingScreen =
  | "Welcome"
  | "Introduction"
  | "PhoneRemembersDevices"
  | "PersonalPrivacy"
  | "GetNotified"
  | "ValueProposition"
  | "EulaModal"
  | "LanguageSelection"

export const OnboardingScreens: {
  [key in OnboardingScreen]: OnboardingScreen
} = {
  Welcome: "Welcome",
  Introduction: "Introduction",
  PhoneRemembersDevices: "PhoneRemembersDevices",
  PersonalPrivacy: "PersonalPrivacy",
  GetNotified: "GetNotified",
  ValueProposition: "ValueProposition",
  EulaModal: "EulaModal",
  LanguageSelection: "LanguageSelection",
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

export type MoreStackScreen =
  | "Menu"
  | "About"
  | "Licenses"
  | "ENDebugMenu"
  | "ENSubmitDebugForm"
  | "LanguageSelection"
  | "AffectedUserFlow"
  | "ExposureListDebugScreen"
  | "ENLocalDiagnosisKey"

export const MoreStackScreens: {
  [key in MoreStackScreen]: MoreStackScreen
} = {
  Menu: "Menu",
  About: "About",
  Licenses: "Licenses",
  LanguageSelection: "LanguageSelection",
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
  | MoreStackScreen
  | SelfAssessmentScreen
  | AffectedUserFlowScreen
  | "Home"

export const Screens: { [key in Screen]: Screen } = {
  ...OnboardingScreens,
  ...ExposureHistoryScreens,
  ...MoreStackScreens,
  ...SelfAssessmentScreens,
  ...AffectedUserFlowScreens,
  Home: "Home",
}

export type Stack =
  | "Activation"
  | "Onboarding"
  | "ExposureHistoryFlow"
  | "SelfAssessment"
  | "More"
  | "AffectedUserStack"

export const Stacks: { [key in Stack]: Stack } = {
  Activation: "Activation",
  Onboarding: "Onboarding",
  ExposureHistoryFlow: "ExposureHistoryFlow",
  SelfAssessment: "SelfAssessment",
  More: "More",
  AffectedUserStack: "AffectedUserStack",
}

export type StatusBarStyle = "dark-content" | "light-content"

export const useStatusBarEffect = (statusBarStyle: StatusBarStyle): void => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(statusBarStyle)
      Platform.OS === "android" && StatusBar.setTranslucent(true)
    }, [statusBarStyle]),
  )
}
