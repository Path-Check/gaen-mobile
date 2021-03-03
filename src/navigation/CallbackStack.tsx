import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { CallbackStackScreens, CallbackStackScreen } from "./index"
import CallbackScreen from "../Callback/Form"
import CallbackSuccess from "../Callback/Success"
import { CallbackFormContext } from "../Callback/CallbackFormContext"
import { applyHeaderLeftBackButton } from "../navigation/HeaderLeftBackButton"

import { Headers } from "../styles"

export type CallbackStackParams = {
  [key in CallbackStackScreen]:
    | {
        fromScreen: CallbackFormFromScreen
      }
    | undefined
}

export type CallbackFormFromScreen = "ExposureHistory" | "VerificationCode"

const Stack = createStackNavigator<CallbackStackParams>()

const CallbackStack: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const route = useRoute<RouteProp<CallbackStackParams, "Form">>()

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
          initialParams={route.params}
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
