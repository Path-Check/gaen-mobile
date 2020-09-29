import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { SelfScreenerScreens } from "."
import SelfScreenerIntro from "../SelfScreener/SelfScreenerIntro"

const Stack = createStackNavigator()
const SelfAssessmentStack: FunctionComponent = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SelfScreenerScreens.SelfScreenerIntro}
        component={SelfScreenerIntro}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default SelfAssessmentStack
