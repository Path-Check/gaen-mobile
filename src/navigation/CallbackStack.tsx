import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { CallbackStackScreens, CallbackStackScreen } from "./index"
import CallbackScreen from "../Callback/Form"
import CallbackSuccess from "../Callback/Success"
import { CallbackFormContext } from "../Callback/CallbackFormContext"
import { applyHeaderLeftBackButton } from "../navigation/HeaderLeftBackButton"

import { Headers } from "../styles"

type CallbackStackParams = {
  [key in CallbackStackScreen]: undefined
}
const Stack = createStackNavigator<CallbackStackParams>()

const CallbackStack: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  return (
    <CallbackFormContext.Provider
      value={{
        callBackRequestCompleted: () => {
          navigation.goBack()
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          ...Headers.headerMinimalOptions,
          title: t("screen_titles.request_callback"),
          headerLeft: applyHeaderLeftBackButton(),
        }}
      >
        <Stack.Screen
          name={CallbackStackScreens.Form}
          component={CallbackScreen}
        />
        <Stack.Screen
          name={CallbackStackScreens.Success}
          component={CallbackSuccess}
        />
      </Stack.Navigator>
    </CallbackFormContext.Provider>
  )
}

export default CallbackStack
