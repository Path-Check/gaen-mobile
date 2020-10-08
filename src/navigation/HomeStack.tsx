import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { HomeStackScreens } from "./index"
import Home from "../Home"

const Stack = createStackNavigator()

const HomeStack: FunctionComponent = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name={HomeStackScreens.Home} component={Home} />
    </Stack.Navigator>
  )
}

export default HomeStack
