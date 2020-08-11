import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
// import env from "react-native-config"

import MainTabNavigator from "./MainTabNavigator"
import OnboardingStack from "./OnboardingStack"
import ActivationStack from "./ActivationStack"
import { useOnboardingContext } from "../OnboardingContext"
import { OnboardingScreens, Screens, Stacks } from "./index"
import AffectedUserStack from "../AffectedUserFlow"
import MoreInfo from "../ExposureHistory/MoreInfo"
import ExposureDetail from "../ExposureHistory/ExposureDetail"
import ProtectPrivacy from "../Onboarding/ProtectPrivacy"

import { Headers, Colors } from "../styles"

const Stack = createStackNavigator()

const SCREEN_OPTIONS = {
  headerShown: false,
}

const HEADER_SCREEN_OPTIONS = {
  headerStyle: {
    ...Headers.headerStyle,
  },
  headerTitleStyle: {
    ...Headers.headerTitleStyle,
  },
  headerBackTitleVisible: false,
  headerTintColor: Colors.headerText,
}

const MainNavigator: FunctionComponent = () => {
  const { onboardingIsComplete } = useOnboardingContext()

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
                title: "MORE INFO",
                ...HEADER_SCREEN_OPTIONS,
              }}
            />
            <Stack.Screen
              name={Screens.ExposureDetail}
              component={ExposureDetail}
              options={{
                title: "EXPOSURE",
                ...HEADER_SCREEN_OPTIONS,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name={Stacks.Onboarding}
              component={OnboardingStack}
              options={{ ...SCREEN_OPTIONS }}
            />
            <Stack.Screen
              name={Stacks.Activation}
              component={ActivationStack}
              options={{ ...SCREEN_OPTIONS }}
            />
            <Stack.Screen
              name={OnboardingScreens.ProtectPrivacy}
              component={ProtectPrivacy}
              options={{
                ...TransitionPresets.ModalPresentationIOS,
                headerShown: false,
                cardOverlayEnabled: true,
                cardShadowEnabled: true,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
