import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
// import env from "react-native-config"

import { Colors } from "../styles"
import MainTabNavigator from "./MainTabNavigator"
import OnboardingStack from "./OnboardingStack"
import { useOnboardingContext } from "../OnboardingContext"
import { Screens, Stacks } from "./index"
import AffectedUserStack from "../AffectedUserFlow"
import MoreInfo from "../ExposureHistory/MoreInfo"
import NextSteps from "../ExposureHistory/NextSteps"

const Stack = createStackNavigator()

const SCREEN_OPTIONS = {
  headerShown: false,
}

const MainNavigator: FunctionComponent = () => {
  const { onboardingIsComplete } = useOnboardingContext()
  // TODO move into next steps
  // const displayNextSteps = Boolean(
  //   env.DISPLAY_SELF_ASSESSMENT === "true" || env.AUTHORITY_ADVICE_URL,
  // )

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {onboardingIsComplete ? (
          <>
            <Stack.Screen
              name={"App"}
              component={MainTabNavigator}
              options={{ ...SCREEN_OPTIONS }}
            />
            <Stack.Screen
              name={Stacks.AffectedUserStack}
              component={AffectedUserStack}
              options={{
                ...TransitionPresets.ModalTransition,
                ...SCREEN_OPTIONS,
              }}
            />
            <Stack.Screen
              name={Screens.MoreInfo}
              component={MoreInfo}
              options={{
                ...TransitionPresets.ModalTransition,
                ...SCREEN_OPTIONS,
              }}
            />
            <Stack.Screen
              name={Screens.Exposure}
              component={NextSteps}
              options={{
                headerStyle: {
                  backgroundColor: Colors.primaryViolet,
                },
                headerTitleStyle: {
                  color: Colors.white,
                  textTransform: "uppercase",
                },
                headerBackTitleVisible: false,
                headerTintColor: Colors.white,
              }}
            />
          </>
        ) : (
          <Stack.Screen name={Stacks.Onboarding} component={OnboardingStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
