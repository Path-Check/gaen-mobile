import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { ConnectStackScreens, ConnectStackScreen } from "./index"
import ConnectScreen from "./../Connect"

type ConnectStackParams = {
  [key in ConnectStackScreen]: undefined
}
const Stack = createStackNavigator<ConnectStackParams>()

const ConnectStack: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ConnectStackScreens.Connect}
        component={ConnectScreen}
      />
    </Stack.Navigator>
  )
}

export default ConnectStack
