import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgXml } from "react-native-svg"

import ExposureHistoryStack from "./ExposureHistoryStack"
import SelfAssessmentStack from "./SelfAssessmentStack"
import HomeStack from "./HomeStack"
import MoreStack from "./MoreStack"
import ReportIssueStack from "./ReportIssueStack"

import { useExposureContext } from "../ExposureContext"
import { useConfigurationContext } from "../ConfigurationContext"

import { Screens, Stacks } from "./index"
import { TabBarIcons } from "../assets/svgs/TabBarNav"
import { Affordances, Colors } from "../styles"

const Tab = createBottomTabNavigator()

const MainTabNavigator: FunctionComponent = () => {
  const { t } = useTranslation()
  const { userHasNewExposure } = useExposureContext()
  const insets = useSafeAreaInsets()
  const {
    displaySelfAssessment,
    displayReportAnIssue,
  } = useConfigurationContext()

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

  interface TabIconProps extends TabBarIconProps {
    icon: string
    label: string
  }

  const TabIcon: FunctionComponent<TabIconProps> = ({
    focused,
    size,
    icon,
    label,
  }) => {
    return (
      <SvgXml
        xml={icon}
        fill={focused ? Colors.primary125 : Colors.secondary100}
        accessible
        accessibilityLabel={label}
        width={size}
        height={size}
      />
    )
  }

  interface TabBarIconProps {
    focused: boolean
    size: number
  }

  const HomeIcon: FunctionComponent<TabBarIconProps> = ({ focused, size }) => {
    return (
      <TabIcon
        icon={TabBarIcons.House}
        label={t("navigation.home")}
        focused={focused}
        size={size}
      />
    )
  }

  const ExposureHistoryIcon: FunctionComponent<TabBarIconProps> = ({
    focused,
    size,
  }) => {
    const tabIcon = (
      <TabIcon
        icon={TabBarIcons.Exposure}
        label={t("navigation.exposure_history")}
        focused={focused}
        size={size}
      />
    )
    return userHasNewExposure ? applyBadge(tabIcon) : tabIcon
  }

  const QuestionMarkIcon: FunctionComponent<TabBarIconProps> = ({
    focused,
    size,
  }) => {
    return (
      <TabIcon
        icon={TabBarIcons.QuestionMark}
        label={t("navigation.report_issue")}
        focused={focused}
        size={size}
      />
    )
  }

  const SelfAssessmentIcon: FunctionComponent<TabBarIconProps> = ({
    focused,
    size,
  }) => {
    return (
      <TabIcon
        icon={TabBarIcons.CheckInBox}
        label={t("navigation.self_assessment")}
        focused={focused}
        size={size}
      />
    )
  }

  const MoreIcon: FunctionComponent<TabBarIconProps> = ({ focused, size }) => {
    return (
      <TabIcon
        icon={TabBarIcons.HorizontalDots}
        label={t("navigation.more")}
        focused={focused}
        size={size}
      />
    )
  }

  return (
    <Tab.Navigator
      initialRouteName={Screens.Home}
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.neutral30,
          height: insets.bottom + 60,
        },
      }}
    >
      <Tab.Screen
        name={Screens.Home}
        component={HomeStack}
        options={{
          tabBarLabel: t("navigation.home"),
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name={Stacks.ExposureHistoryFlow}
        component={ExposureHistoryStack}
        options={{
          tabBarLabel: t("navigation.exposure_history"),
          tabBarIcon: ExposureHistoryIcon,
        }}
      />
      {displayReportAnIssue && (
        <Tab.Screen
          name={Stacks.ReportIssue}
          component={ReportIssueStack}
          options={{
            tabBarLabel: t("navigation.report_issue"),
            tabBarIcon: QuestionMarkIcon,
          }}
        />
      )}
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
