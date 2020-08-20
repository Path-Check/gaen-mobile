import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import MenuScreen from "./../More/Menu"
import AboutScreen from "./../More/About"
import LegalScreen from "./../More/Legal"
import ENDebugMenu from "./../More/ENDebugMenu"
import ENLocalDiagnosisKeyScreen from "./../More/ENLocalDiagnosisKeyScreen"
import ExposureListDebugScreen from "./../More/ExposureListDebugScreen"

import { MoreStackScreens, MoreStackScreen } from "./index"

import { Colors, Headers } from "../styles"

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
        name={MoreStackScreens.Legal}
        component={LegalScreen}
        options={{ headerTitle: t("screen_titles.legal") }}
      />
      <Stack.Screen
        name={MoreStackScreens.ENDebugMenu}
        component={ENDebugMenu}
        options={{ headerTitle: t("screen_titles.debug") }}
      />
      <Stack.Screen
        name={MoreStackScreens.ExposureListDebugScreen}
        component={ExposureListDebugScreen}
        options={{ headerTitle: t("screen_titles.exposures") }}
      />
      <Stack.Screen
        name={MoreStackScreens.ENLocalDiagnosisKey}
        component={ENLocalDiagnosisKeyScreen}
      />
    </Stack.Navigator>
  )
}

export default MoreStack
