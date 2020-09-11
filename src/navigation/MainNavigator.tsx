import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { Platform } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useOnboardingContext } from "../OnboardingContext"
import { OtherScreens, ExposureHistoryScreens, Stacks } from "./index"
import MainTabNavigator from "./MainTabNavigator"
import HowItWorksStack from "./HowItWorksStack"
import ActivationStack from "./ActivationStack"
import SettingsStack from "./SettingsStack"
import ModalStack from "./ModalStack"
import MoreInfo from "../ExposureHistory/MoreInfo"
import Welcome from "../Welcome"
import ExposureDetail from "../ExposureHistory/ExposureDetail"

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
  headerTitleAlign: "center",
}

const settingsStackTransitionPreset = Platform.select({
  ios: TransitionPresets.SlideFromRightIOS,
  android: TransitionPresets.DefaultTransition,
})

const MainNavigator: FunctionComponent = () => {
  const { t } = useTranslation()
  const { isOnboardingComplete } = useOnboardingContext()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isOnboardingComplete ? (
          <>
            <Stack.Screen
              name={"App"}
              component={MainTabNavigator}
              options={defaultScreenOptions}
            />
            <Stack.Screen
              name={Stacks.Settings}
              component={SettingsStack}
              options={{
                ...settingsStackTransitionPreset,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={ExposureHistoryScreens.MoreInfo}
              component={MoreInfo}
              options={{
                ...headerScreenOptions,
                title: t("navigation.more_info"),
              }}
            />
            <Stack.Screen
              name={ExposureHistoryScreens.ExposureDetail}
              component={ExposureDetail}
              options={{
                ...headerScreenOptions,
                title: t("navigation.exposure"),
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name={OtherScreens.Welcome}
              component={Welcome}
              options={defaultScreenOptions}
            />
            <Stack.Screen
              name={Stacks.HowItWorks}
              options={defaultScreenOptions}
            >
              {(props) => (
                <HowItWorksStack
                  {...props}
                  destinationOnSkip={Stacks.Activation}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name={Stacks.Activation}
              component={ActivationStack}
              options={{
                ...defaultScreenOptions,
                gestureEnabled: false,
              }}
            />
          </>
        )}
        <Stack.Screen
          name={Stacks.Modal}
          component={ModalStack}
          options={{
            ...TransitionPresets.ModalTransition,
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
