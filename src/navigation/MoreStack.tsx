import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import MenuScreen from "./../More/Menu"
import AboutScreen from "./../More/About"
import LicensesScreen from "./../More/Licenses"
import ENDebugMenu from "./../More/ENDebugMenu"
import ENLocalDiagnosisKeyScreen from "./../More/ENLocalDiagnosisKeyScreen"
import ENSubmitDebugForm from "./../More/ENSubmitDebugForm"
import ExposureListDebugScreen from "./../More/ExposureListDebugScreen"
import LanguageSelection from "../More/LanguageSelection"

import { MoreStackScreens, MoreStackScreen } from "./index"

import { Colors, Headers } from "../styles"
import FeedbackForm from "../More/FeedbackForm"

type MoreStackParams = {
  [key in MoreStackScreen]: undefined
}
const Stack = createStackNavigator<MoreStackParams>()

const SCREEN_OPTIONS: StackNavigationOptions = {
  headerStyle: {
    ...Headers.headerStyle,
  },
  headerTitleStyle: {
    ...Headers.headerTitleStyle,
  },
  headerBackTitleVisible: false,
  headerTintColor: Colors.headerText,
}

const MoreStack: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name={MoreStackScreens.Menu} component={MenuScreen} />
      <Stack.Screen name={MoreStackScreens.About} component={AboutScreen} />
      <Stack.Screen
        name={MoreStackScreens.Licenses}
        component={LicensesScreen}
        options={{ headerTitle: t("screen_titles.legal") }}
      />
      <Stack.Screen
        name={MoreStackScreens.ENDebugMenu}
        component={ENDebugMenu}
        options={{ headerTitle: t("screen_titles.debug") }}
      />
      <Stack.Screen
        name={MoreStackScreens.LanguageSelection}
        component={LanguageSelection}
        options={{ headerTitle: t("screen_titles.select_language") }}
      />
      <Stack.Screen
        name={MoreStackScreens.ExposureListDebugScreen}
        component={ExposureListDebugScreen}
      />
      <Stack.Screen
        name={MoreStackScreens.ENLocalDiagnosisKey}
        component={ENLocalDiagnosisKeyScreen}
      />
      <Stack.Screen
        name={MoreStackScreens.ENSubmitDebugForm}
        component={ENSubmitDebugForm}
        options={{ headerTitle: t("screen_titles.debug_form") }}
      />
      <Stack.Screen
        name={MoreStackScreens.FeedbackForm}
        component={FeedbackForm}
        options={{ headerTitle: t("screen_titles.feedback") }}
      />
    </Stack.Navigator>
  )
}

export default MoreStack
