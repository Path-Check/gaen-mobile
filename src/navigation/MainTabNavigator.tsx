import React, { useContext, FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import ExposureHistoryStack from "./ExposureHistoryStack"
import MoreStack, {
  determineTabBarVisibility,
  MoreStackRoute,
} from "./MoreStack"
import SelfAssessmentStack from "./SelfAssessmentStack"
import HomeScreen from "../Home"

import ExposureHistoryContext from "../ExposureHistoryContext"

import { Screens, Stacks } from "./index"
import * as Icons from "../assets/svgs/TabBarNav"
import { Layout, Affordances, Colors } from "../styles"

const Tab = createBottomTabNavigator()

const MainTabNavigator: FunctionComponent = () => {
  const { t } = useTranslation()
  const { userHasNewExposure } = useContext(ExposureHistoryContext)

  const applyBadge = (icon: JSX.Element) => {
    return (
      <>
        {icon}
        <View style={styles.iconBadge} />
      </>
    )
  }

  const styles = StyleSheet.create({
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
        width={size}
        height={size}
      />
    )
  }

  const CalendarIcon: FunctionComponent<TabBarIconProps> = ({
    focused,
    size,
  }) => {
    const tabIcon = (
      <SvgXml
        xml={focused ? Icons.CalendarActive : Icons.CalendarInactive}
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
        width={size}
        height={size}
      />
    )
  }

  const MoreIcon: FunctionComponent<TabBarIconProps> = ({ focused, size }) => {
    return (
      <SvgXml
        xml={focused ? Icons.MoreActive : Icons.MoreInactive}
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
        inactiveTintColor: Colors.primaryViolet,
        style: {
          backgroundColor: Colors.navBar,
          borderTopColor: Colors.navBar,
          height: Layout.navBar,
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
          tabBarIcon: CalendarIcon,
        }}
      />
      <Tab.Screen
        name={Stacks.SelfAssessment}
        component={SelfAssessmentStack}
        options={{
          tabBarLabel: t("navigation.self_assessment"),
          tabBarIcon: SelfAssessmentIcon,
        }}
      />
      <Tab.Screen
        name={Stacks.More}
        component={MoreStack}
        options={({ route }) => ({
          tabBarVisible: determineTabBarVisibility(route as MoreStackRoute),
          tabBarLabel: t("navigation.more"),
          tabBarIcon: MoreIcon,
        })}
      />
    </Tab.Navigator>
  )
}

export default MainTabNavigator

