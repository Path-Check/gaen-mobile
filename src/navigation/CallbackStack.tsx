import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { CallbackStackScreens, CallbackStackScreen } from "./index"
import CallbackScreen from "../Callback/Form"
import CallbackSuccess from "../Callback/Success"

type CallbackStackParams = {
  [key in CallbackStackScreen]: undefined
}
const Stack = createStackNavigator<CallbackStackParams>()

const CallbackStack: FunctionComponent = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name={CallbackStackScreens.Form}
        component={CallbackScreen}
      />
      <Stack.Screen
        name={CallbackStackScreens.Success}
        component={CallbackSuccess}
      />
    </Stack.Navigator>
  )
}

export default CallbackStack
