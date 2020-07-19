import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackCardInterpolationProps,
} from "@react-navigation/stack"

import Assessment from "../views/assessment/index"

import { Screens } from "./index"

const Stack = createStackNavigator()

const fade = ({ current }: StackCardInterpolationProps) => ({
  cardStyle: { opacity: current.progress },
})

const SCREEN_OPTIONS = {
  headerShown: false,
}

const SelfAssessmentStack: FunctionComponent = () => (
  <Stack.Navigator
    mode="modal"
    screenOptions={{
      ...SCREEN_OPTIONS,
      cardStyleInterpolator: fade,
      gestureEnabled: false,
    }}
  >
    <Stack.Screen name={Screens.SelfAssessment} component={Assessment} />
  </Stack.Navigator>
)

export default SelfAssessmentStack
