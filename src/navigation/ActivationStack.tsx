import React, { FunctionComponent } from "react"
import { TouchableOpacity, StyleSheet, View } from "react-native"
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { GlobalText } from "../components"
import { Stacks, ActivationScreen, ActivationScreens } from "./index"

import ActivateProximityTracing from "../Onboarding/ActivateProximityTracing"
import NotificationPermissions from "../Onboarding/NotificationPermissions"

import { Icons } from "../assets"
import { Spacing, Colors, Typography } from "../styles"

type ActivationStackParams = {
  [key in ActivationScreen]: undefined
}

const Stack = createStackNavigator<ActivationStackParams>()

const ActivationStack: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  type ActivationStep = "ActivateProximityTracing" | "NotificationPermissions"

  const HeaderRight = (step: ActivationStep) => {
    const determineStepText = () => {
      switch (step) {
        case "ActivateProximityTracing":
          return t("onboarding.step_2_of_3")
        case "NotificationPermissions":
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
          onPress={() => navigation.navigate(Stacks.Onboarding)}
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

  const screenOptions: StackNavigationOptions = {
    headerShown: true,
    headerLeft: () => null,
    headerTitleAlign: "left",
    headerTitle: "App Setup",
    headerTitleStyle: style.headerTitle,
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
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
