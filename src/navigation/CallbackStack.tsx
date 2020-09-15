import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackNavigationOptions,
  HeaderBackButton,
} from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { CallbackStackScreens, CallbackStackScreen } from "./index"
import CallbackScreen from "../Callback/Form"
import CallbackSuccess from "../Callback/Success"
import { CallbackFormContext } from "../Callback/CallbackFormContext"

import { Colors, Headers } from "../styles"

type CallbackStackParams = {
  [key in CallbackStackScreen]: undefined
}
const Stack = createStackNavigator<CallbackStackParams>()

const HeaderLeft = () => {
  const navigation = useNavigation()

  return (
    <HeaderBackButton
      labelVisible={false}
      tintColor={Colors.white}
      onPress={() => navigation.goBack()}
    />
  )
}

const CallbackStack: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const defaultScreenOptions: StackNavigationOptions = {
    headerStyle: {
      ...Headers.headerStyle,
    },
    headerTitleStyle: {
      ...Headers.headerTitleStyle,
    },
    headerBackTitleVisible: false,
    headerTintColor: Colors.headerText,
    headerTitleAlign: "center",
    headerLeft: function headerLeft() {
      return <HeaderLeft />
    },
    title: t("screen_titles.callback"),
  }

  return (
    <CallbackFormContext.Provider
      value={{
        callBackRequestCompleted: () => {
          navigation.goBack()
        },
      }}
    >
      <Stack.Navigator screenOptions={defaultScreenOptions}>
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
