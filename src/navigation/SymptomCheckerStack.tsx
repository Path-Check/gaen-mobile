import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { SymptomCheckerStackScreens } from "./index"
import SymptomCheckerScreen from "../SymptomChecker/"

const Stack = createStackNavigator()

const SymptomCheckerStack: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SymptomCheckerStackScreens.SymptomChecker}
        component={SymptomCheckerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default SymptomCheckerStack
