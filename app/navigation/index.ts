import { useCallback } from "react"
import { Platform, StatusBar } from "react-native"
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from "react-navigation"
import { useFocusEffect } from "@react-navigation/native"

export type NavigationProp = NavigationScreenProp<
  NavigationState,
  NavigationParams
>

export type Screen =
  | "NextSteps"
  | "MoreInfo"
  | "ENDebugMenu"
  | "ENLocalDiagnosisKey"
  | "ExposureListDebugScreen"
  | "Settings"
  | "About"
  | "Licenses"
  | "Welcome"
  | "PersonalPrivacy"
  | "NotificationDetails"
  | "ShareDiagnosis"
  | "NotificationPermissions"
  | "EnableExposureNotifications"
  | "SelfAssessment"
  | "LanguageSelection"
  | "AffectedUserStart"
  | "AffectedUserCodeInput"
  | "AffectedUserPublishConsent"
  | "AffectedUserConfirmUpload"
  | "AffectedUserExportDone"
  | "AffectedUserComplete"
  | "Home"
  | "ExposureHistory"

export const Screens: { [key in Screen]: Screen } = {
  NextSteps: "NextSteps",
  MoreInfo: "MoreInfo",
  ENDebugMenu: "ENDebugMenu",
  ENLocalDiagnosisKey: "ENLocalDiagnosisKey",
  ExposureListDebugScreen: "ExposureListDebugScreen",
  Settings: "Settings",
  About: "About",
  Licenses: "Licenses",
  Welcome: "Welcome",
  PersonalPrivacy: "PersonalPrivacy",
  NotificationDetails: "NotificationDetails",
  ShareDiagnosis: "ShareDiagnosis",
  NotificationPermissions: "NotificationPermissions",
  EnableExposureNotifications: "EnableExposureNotifications",
  SelfAssessment: "SelfAssessment",
  LanguageSelection: "LanguageSelection",
  AffectedUserStart: "AffectedUserStart",
  AffectedUserCodeInput: "AffectedUserCodeInput",
  AffectedUserPublishConsent: "AffectedUserPublishConsent",
  AffectedUserConfirmUpload: "AffectedUserConfirmUpload",
  AffectedUserExportDone: "AffectedUserExportDone",
  AffectedUserComplete: "AffectedUserComplete",
  Home: "Home",
  ExposureHistory: "ExposureHistory",
}

export type Stack =
  | "Onboarding"
  | "ExposureHistoryFlow"
  | "SelfAssessment"
  | "More"
  | "AffectedUserFlow"

export const Stacks: { [key in Stack]: Stack } = {
  Onboarding: "Onboarding",
  ExposureHistoryFlow: "ExposureHistoryFlow",
  SelfAssessment: "SelfAssessment",
  More: "More",
  AffectedUserFlow: "AffectedUserFlow",
}

type BarStyle = "dark-content" | "light-content"

export const useStatusBarEffect = (barStyle: BarStyle): void => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(barStyle)
      Platform.OS === "android" && StatusBar.setTranslucent(true)
    }, [barStyle]),
  )
}
