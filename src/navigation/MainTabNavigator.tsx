import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgXml } from "react-native-svg"
import env from "react-native-config"

import ExposureHistoryStack from "./ExposureHistoryStack"
import SelfAssessmentStack from "./SelfAssessmentStack"
import HomeScreen from "../Home/Home"
import MoreStack from "./MoreStack"

import { useExposureContext } from "../ExposureContext"

import { Screens, Stacks } from "./index"
import * as Icons from "../assets/svgs/TabBarNav"
import { Affordances, Colors } from "../styles"

const Tab = createBottomTabNavigator()

const MainTabNavigator: FunctionComponent = () => {
  const { t } = useTranslation()
  const { userHasNewExposure } = useExposureContext()
  const insets = useSafeAreaInsets()
  const displaySelfAssessment = env.DISPLAY_SELF_ASSESSMENT === "true"

  const applyBadge = (icon: JSX.Element) => {
    return (
      <>
        {icon}
        <View style={style.iconBadge} />
      </>
    )
  }

  const style = StyleSheet.create({
    iconBadge: {
      ...Affordances.iconBadge,
    },
  })

  interface TabBarIconProps {
    focused: boolean
    size: number
  }

  const HomeIcon: FunctionComponent<TabBarIconProps> = ({ focused, size }) => {
    return (
      <SvgXml
        xml={focused ? Icons.HomeActive : Icons.HomeInactive}
        accessible
        accessibilityLabel={t("label.home_icon")}
        width={size}
        height={size}
      />
    )
  }

  const ExposureHistoryIcon: FunctionComponent<TabBarIconProps> = ({
    focused,
    size,
  }) => {
    const tabIcon = (
      <SvgXml
        xml={focused ? Icons.HistoryActive : Icons.HistoryInactive}
        accessible
        accessibilityLabel={t("label.calendar_icon")}
        width={size}
        height={size}
      />
    )
    return userHasNewExposure ? applyBadge(tabIcon) : tabIcon
  }

  const SelfAssessmentIcon: FunctionComponent<TabBarIconProps> = ({
    focused,
    size,
  }) => {
    return (
      <SvgXml
        xml={
          focused ? Icons.SelfAssessmentActive : Icons.SelfAssessmentInactive
        }
        accessible
        accessibilityLabel={t("label.assessment_icon")}
        width={size}
        height={size}
      />
    )
  }

  const MoreIcon: FunctionComponent<TabBarIconProps> = ({ focused, size }) => {
    return (
      <SvgXml
        xml={focused ? Icons.MoreActive : Icons.MoreInactive}
        accessible
        accessibilityLabel={t("label.more_icon")}
        width={size}
        height={size}
      />
    )
  }

  return (
    <Tab.Navigator
      initialRouteName={Screens.Home}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: Colors.white,
        inactiveTintColor: Colors.tertiaryViolet,
        style: {
          backgroundColor: Colors.headerBackground,
          borderTopColor: Colors.headerBackground,
          height: insets.bottom + 60,
        },
      }}
    >
      <Tab.Screen
        name={Screens.Home}
        component={HomeScreen}
        options={{
          tabBarLabel: t("navigation.home"),
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name={Stacks.ExposureHistoryFlow}
        component={ExposureHistoryStack}
        options={{
          tabBarLabel: t("navigation.history"),
          tabBarIcon: ExposureHistoryIcon,
        }}
      />
      {displaySelfAssessment && (
        <Tab.Screen
          name={Stacks.SelfAssessment}
          component={SelfAssessmentStack}
          options={{
            tabBarLabel: t("navigation.self_assessment"),
            tabBarIcon: SelfAssessmentIcon,
          }}
        />
      )}
      <Tab.Screen
        name={Stacks.More}
        component={MoreStack}
        options={{
          tabBarLabel: t("navigation.more"),
          tabBarIcon: MoreIcon,
        }}
      />
    </Tab.Navigator>
  )
}

export default MainTabNavigator
