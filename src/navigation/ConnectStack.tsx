import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { ConnectStackScreens } from "./index"
import ConnectScreen from "../Connect"

const Stack = createStackNavigator()

const ConnectStack: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ConnectStackScreens.Connect}
        component={ConnectScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default ConnectStack
