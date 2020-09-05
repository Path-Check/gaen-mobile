import React, { FunctionComponent } from "react"
import { Platform, TouchableOpacity, StyleSheet, View } from "react-native"
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { GlobalText } from "../components"
import { Stacks, ActivationScreen, ActivationScreens } from "./index"
import { useSystemServicesContext } from "../SystemServicesContext"

import ActivateProximityTracing from "../Activation/ActivateProximityTracing"
import ActivateLocation from "../Activation/ActivateLocation"
import NotificationPermissions from "../Activation/NotificationPermissions"
import ActivationSummary from "../Activation/ActivationSummary"

import { Icons } from "../assets"
import { Layout, Spacing, Colors, Typography } from "../styles"

type ActivationStackParams = {
  [key in ActivationScreen]: undefined
}

const Stack = createStackNavigator<ActivationStackParams>()

const ActivationStack: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { isLocationNeeded } = useSystemServicesContext()

  interface ActivationStep {
    screenName: ActivationScreen
    component: FunctionComponent
  }

  const activateProximityTracing: ActivationStep = {
    screenName: ActivationScreens.ActivateProximityTracing,
    component: ActivateProximityTracing,
  }

  const activateLocation: ActivationStep = {
    screenName: ActivationScreens.ActivateLocation,
    component: ActivateLocation,
  }

  const notificationPermissions: ActivationStep = {
    screenName: ActivationScreens.NotificationPermissions,
    component: NotificationPermissions,
  }

  const activationStepsIOS: ActivationStep[] = [
    activateProximityTracing,
    notificationPermissions,
  ]

  const activationStepsAndroid: ActivationStep[] = isLocationNeeded
    ? [activateProximityTracing, activateLocation]
    : [activateProximityTracing]

  const activationSteps = Platform.select({
    ios: activationStepsIOS,
    android: activationStepsAndroid,
    default: activationStepsIOS,
  })

  const CloseButton = () => {
    const handleOnPressClose = () => {
      navigation.navigate(Stacks.Onboarding)
    }

    return (
      <TouchableOpacity onPress={handleOnPressClose}>
        <SvgXml
          xml={Icons.Close}
          fill={Colors.neutral140}
          style={style.closeIcon}
          accessible
          accessibilityLabel={t("common.close")}
        />
      </TouchableOpacity>
    )
  }

  const HeaderRight: FunctionComponent = () => {
    return (
      <View style={style.headerRight}>
        <CloseButton />
      </View>
    )
  }

  interface HeaderRightWithStepsProps {
    currentStep: number
    totalSteps: number
  }

  const HeaderRightWithSteps: FunctionComponent<HeaderRightWithStepsProps> = ({
    currentStep,
    totalSteps,
  }) => {
    return (
      <View style={style.headerRight}>
        <GlobalText style={style.headerRightText}>
          {t("onboarding.step", { currentStep, totalSteps })}
        </GlobalText>
        <CloseButton />
      </View>
    )
  }

  const screenOptions: StackNavigationOptions = {
    headerShown: true,
    headerLeft: () => null,
    headerTitleAlign: "left",
    headerTitle: t("onboarding.activation_header_title"),
    headerTitleStyle: style.headerTitle,
    gestureEnabled: false,
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {activationSteps.map((step, idx) => {
        const currentStep = idx + 1
        return (
          <Stack.Screen
            name={step.screenName}
            component={step.component}
            key={`activation-screen-${step.screenName}`}
            options={{
              headerRight: () =>
                HeaderRightWithSteps({
                  currentStep,
                  totalSteps: activationSteps.length,
                }),
            }}
          />
        )
      })}
      <Stack.Screen
        name={ActivationScreens.ActivationSummary}
        component={ActivationSummary}
        options={{
          headerRight: () => HeaderRight({}),
        }}
      />
    </Stack.Navigator>
  )
}

const style = StyleSheet.create({
  headerTitle: {
    ...Typography.header4,
    color: Colors.neutral100,
    maxWidth: Layout.halfWidth,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRightText: {
    ...Typography.body1,
    color: Colors.neutral100,
  },
  closeIcon: {
    paddingHorizontal: Spacing.large,
  },
})

export default ActivationStack
