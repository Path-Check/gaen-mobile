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

import AcceptEula from "../Activation/AcceptEula"
import ActivateProximityTracing from "../Activation/ActivateProximityTracing"
import NotificationPermissions from "../Activation/NotificationPermissions"

import { Icons } from "../assets"
import { Spacing, Colors, Typography } from "../styles"

type ActivationStackParams = {
  [key in ActivationScreen]: undefined
}

const Stack = createStackNavigator<ActivationStackParams>()

const ActivationStack: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  type ActivationStep =
    | "ActivateProximityTracing"
    | "NotificationPermissions"
    | "AcceptEula"

  const HeaderRight = (step: ActivationStep) => {
    const determineStepText = () => {
      const totalSteps = Platform.OS === "ios" ? 3 : 2

      switch (step) {
        case "AcceptEula":
          return t("onboarding.step", { currentStep: 1, totalSteps })
        case "ActivateProximityTracing":
          return t("onboarding.step", { currentStep: 2, totalSteps })
        case "NotificationPermissions":
          return t("onboarding.step", { currentStep: 3, totalSteps })
        default:
          return t("onboarding.step", { currentStep: 1, totalSteps })
      }
    }

    return (
      <View style={style.headerRight}>
        <GlobalText style={style.headerRightText}>
          {determineStepText()}
        </GlobalText>
        <TouchableOpacity
          onPress={() => navigation.navigate(Stacks.Onboarding)}
        >
          <SvgXml
            xml={Icons.Close}
            fill={Colors.darkestGray}
            style={style.closeIcon}
            accessible
            accessibilityLabel={t("common.close")}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const screenOptions: StackNavigationOptions = {
    headerShown: true,
    headerLeft: () => null,
    headerTitleAlign: "left",
    headerTitle: t("onboarding.activation_header_title"),
    headerTitleStyle: style.headerTitle,
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name={ActivationScreens.AcceptEula}
        component={AcceptEula}
        options={{
          headerRight: () => HeaderRight("AcceptEula"),
        }}
      />
      <Stack.Screen
        name={ActivationScreens.ActivateProximityTracing}
        component={ActivateProximityTracing}
        options={{
          headerRight: () => HeaderRight("ActivateProximityTracing"),
        }}
      />
      <Stack.Screen
        name={ActivationScreens.NotificationPermissions}
        component={NotificationPermissions}
        options={{
          headerRight: () => HeaderRight("NotificationPermissions"),
        }}
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

export default ActivationStack
