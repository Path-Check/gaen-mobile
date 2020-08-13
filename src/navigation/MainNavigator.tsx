import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"

import MainTabNavigator from "./MainTabNavigator"
import OnboardingStack from "./OnboardingStack"
import ActivationStack from "./ActivationStack"
import { useOnboardingContext } from "../OnboardingContext"
import { OnboardingScreens, Screens, Stacks } from "./index"
import AffectedUserStack from "../AffectedUserFlow"
import MoreInfo from "../ExposureHistory/MoreInfo"
import ExposureDetail from "../ExposureHistory/ExposureDetail"
import ProtectPrivacy from "../Onboarding/ProtectPrivacy"
import LanguageSelection from "../More/LanguageSelection"

import { Headers, Colors } from "../styles"

const Stack = createStackNavigator()

const defaultScreenOptions = {
  headerShown: false,
}

const headerScreenOptions: StackNavigationOptions = {
  headerStyle: {
    ...Headers.headerStyle,
  },
  headerTitleStyle: {
    ...Headers.headerTitleStyle,
  },
  headerBackTitleVisible: false,
  headerTintColor: Colors.headerText,
}
const cardScreenOptions: StackNavigationOptions = {
  ...TransitionPresets.ModalPresentationIOS,
  headerShown: false,
  cardOverlayEnabled: true,
  cardShadowEnabled: true,
}

const MainNavigator: FunctionComponent = () => {
  const { onboardingIsComplete } = useOnboardingContext()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <>
          {onboardingIsComplete ? (
            <>
              <Stack.Screen
                name={"App"}
                component={MainTabNavigator}
                options={defaultScreenOptions}
              />
              <Stack.Screen
                name={Stacks.AffectedUserStack}
                component={AffectedUserStack}
                options={{
                  ...TransitionPresets.ModalTransition,
                  ...defaultScreenOptions,
                }}
              />
              <Stack.Screen
                name={Screens.MoreInfo}
                component={MoreInfo}
                options={{
                  title: "MORE INFO",
                  ...headerScreenOptions,
                }}
              />
              <Stack.Screen
                name={Screens.ExposureDetail}
                component={ExposureDetail}
                options={{
                  title: "EXPOSURE",
                  ...headerScreenOptions,
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name={Stacks.Onboarding}
                component={OnboardingStack}
                options={defaultScreenOptions}
              />
              <Stack.Screen
                name={Stacks.Activation}
                component={ActivationStack}
                options={defaultScreenOptions}
              />
              <Stack.Screen
                name={OnboardingScreens.ProtectPrivacy}
                component={ProtectPrivacy}
                options={cardScreenOptions}
              />
            </>
          )}
          <Stack.Screen
            name={Screens.LanguageSelection}
            component={LanguageSelection}
            options={cardScreenOptions}
          />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
