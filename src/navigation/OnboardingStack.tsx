import React, { FunctionComponent } from "react"
import { TouchableOpacity, StyleSheet, View } from "react-native"
import {
  TransitionPresets,
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { OnboardingScreen, OnboardingScreens } from "./index"
import { GlobalText } from "../components"

import NotificationPermissions from "../Onboarding/NotificationPermissions"
import EnableExposureNotifications from "../Onboarding/EnableExposureNotifications"
import Welcome from "../Onboarding/Welcome"
import PersonalPrivacy from "../Onboarding/PersonalPrivacy"
import EulaModal from "../Onboarding/EulaModal"
import LanguageSelection from "../More/LanguageSelection"
import Introduction from "../Onboarding/Introduction"
import PhoneRemembersDevices from "../Onboarding/PhoneRemembersDevices"
import GetNotified from "../Onboarding/GetNotified"
import ValueProposition from "../Onboarding/ValueProposition"

import { Icons } from "../assets"
import { Spacing, Colors, Typography } from "../styles"

type OnboardingStackParams = {
  [key in OnboardingScreen]: undefined
}

const Stack = createStackNavigator<OnboardingStackParams>()

const OnboardingStack: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const onboardingScreenOptions: StackNavigationOptions = {
    headerShown: false,
  }

  const HeaderRight = (stepNumber: number) => {
    const determineStepText = () => {
      switch (stepNumber) {
        case 1:
          return t("onboarding.step_1_of_3")
        case 2:
          return t("onboarding.step_2_of_3")
        case 3:
          return t("onboarding.step_3_of_3")
        default:
          return t("onboarding.step_1_of_3")
      }
    }

    return (
      <View style={style.headerRight}>
        <GlobalText style={style.headerRightText}>
          {determineStepText()}
        </GlobalText>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(OnboardingScreens.ValueProposition)
          }
        >
          <SvgXml
            xml={Icons.Close}
            fill={Colors.darkestGray}
            style={style.closeIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const appSetupOptions: StackNavigationOptions = {
    headerShown: true,
    headerLeft: () => null,
    headerTitleAlign: "left",
    headerTitle: "App Setup",
    headerTitleStyle: style.headerTitle,
  }

  return (
    <Stack.Navigator screenOptions={onboardingScreenOptions}>
      <Stack.Screen name={OnboardingScreens.Welcome} component={Welcome} />
      <Stack.Screen
        name={OnboardingScreens.EulaModal}
        component={EulaModal}
        options={{ ...TransitionPresets.ModalTransition }}
      />
      <Stack.Screen
        name={OnboardingScreens.Introduction}
        component={Introduction}
      />
      <Stack.Screen
        name={OnboardingScreens.PhoneRemembersDevices}
        component={PhoneRemembersDevices}
      />
      <Stack.Screen
        name={OnboardingScreens.PersonalPrivacy}
        component={PersonalPrivacy}
      />
      <Stack.Screen
        name={OnboardingScreens.GetNotified}
        component={GetNotified}
      />
      <Stack.Screen
        name={OnboardingScreens.ValueProposition}
        component={ValueProposition}
      />
      <Stack.Screen
        name={OnboardingScreens.EnableExposureNotifications}
        component={EnableExposureNotifications}
        options={{
          ...appSetupOptions,
          headerRight: () => HeaderRight(2),
        }}
      />
      <Stack.Screen
        name={OnboardingScreens.NotificationPermissions}
        component={NotificationPermissions}
        options={{
          ...appSetupOptions,
          headerRight: () => HeaderRight(3),
        }}
      />
      <Stack.Screen
        name={OnboardingScreens.LanguageSelection}
        component={LanguageSelection}
      />
    </Stack.Navigator>
  )
}

const style = StyleSheet.create({
  headerTitle: {
    ...Typography.base,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRightText: {
    ...Typography.base,
    color: Colors.mediumGray,
  },
  closeIcon: {
    paddingHorizontal: Spacing.large,
  },
})

export default OnboardingStack

