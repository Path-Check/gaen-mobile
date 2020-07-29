import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
// import env from "react-native-config"

import MainTabNavigator from "./MainTabNavigator"
import OnboardingStack from "./OnboardingStack"
import { useOnboardingContext } from "../OnboardingContext"
import { Screens, Stacks } from "./index"
import AffectedUserStack from "../AffectedUserFlow"
import MoreInfo from "../ExposureHistory/MoreInfo"
import ExposureDetail from "../ExposureHistory/ExposureDetail"

import { Colors } from "../styles"

const Stack = createStackNavigator()

const SCREEN_OPTIONS = {
  headerShown: false,
}

const RIGHT_SLIDING_MODAL_OPTIONS = {
  headerStyle: {
    backgroundColor: Colors.primaryViolet,
  },
  headerTitleStyle: {
    color: Colors.white,
  },
  headerBackTitleVisible: false,
  headerTintColor: Colors.white,
}

const MainNavigator: FunctionComponent = () => {
  const { onboardingIsComplete } = useOnboardingContext()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {false ? (
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
                title: "MORE INFO",
                ...RIGHT_SLIDING_MODAL_OPTIONS,
              }}
            />
            <Stack.Screen
              name={Screens.ExposureDetail}
              component={ExposureDetail}
              options={{
                title: "EXPOSURE",
                ...RIGHT_SLIDING_MODAL_OPTIONS,
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name={Stacks.Onboarding}
            component={OnboardingStack}
            options={{ ...SCREEN_OPTIONS }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator

