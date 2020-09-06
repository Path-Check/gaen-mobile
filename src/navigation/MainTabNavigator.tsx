import React, { FunctionComponent } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgXml } from "react-native-svg"

import ExposureHistoryStack from "./ExposureHistoryStack"
import SelfAssessmentStack from "./SelfAssessmentStack"
import HomeStack from "./HomeStack"
import MoreStack from "./MoreStack"
import ReportIssueStack from "./ReportIssueStack"

import { useConfigurationContext } from "../ConfigurationContext"

import { Screens, Stacks } from "./index"
import { TabBarIcons } from "../assets/svgs/TabBarNav"
import { Colors } from "../styles"

const Tab = createBottomTabNavigator()

const MainTabNavigator: FunctionComponent = () => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const {
    displaySelfAssessment,
    displayReportAnIssue,
  } = useConfigurationContext()

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
    return tabIcon
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
    </Tab.Navigator>
  )
}

export default MainTabNavigator
