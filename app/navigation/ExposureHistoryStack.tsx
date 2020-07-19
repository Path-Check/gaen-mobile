import React, { FunctionComponent, useContext, useEffect } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"

import ExposureHistoryContext from "../ExposureHistoryContext"
import ExposureHistoryScreen from "../views/ExposureHistory"
import NextSteps from "../views/ExposureHistory/NextSteps"
import MoreInfo from "../views/ExposureHistory/MoreInfo"

import { Screens } from "./index"

const Stack = createStackNavigator()

const SCREEN_OPTIONS = {
  headerShown: false,
}

const ExposureHistoryStack: FunctionComponent = () => {
  const navigation = useNavigation()
  const { observeExposures } = useContext(ExposureHistoryContext)

  useEffect(() => {
    const unsubscribeTabPress = navigation.addListener("focus", () => {
      observeExposures()
    })
    return unsubscribeTabPress
  }, [navigation, observeExposures])

  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        ...SCREEN_OPTIONS,
      }}
    >
      <Stack.Screen
        name={Screens.ExposureHistory}
        component={ExposureHistoryScreen}
      />
      <Stack.Screen name={Screens.NextSteps} component={NextSteps} />
      <Stack.Screen name={Screens.MoreInfo} component={MoreInfo} />
    </Stack.Navigator>
  )
}

export default ExposureHistoryStack
