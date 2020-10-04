import React, { FunctionComponent } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgXml } from "react-native-svg"

import ExposureHistoryStack from "./ExposureHistoryStack"
import HomeStack from "./HomeStack"
import MyHealthStack from "./MyHealthStack"
import ConnectStack from "./ConnectStack"
import { useConfigurationContext } from "../ConfigurationContext"

import { Stacks } from "./index"
import { TabBarIcons } from "../assets/svgs/TabBarNav"
import { Colors } from "../styles"

const Tab = createBottomTabNavigator()

const MainTabNavigator: FunctionComponent = () => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { displayMyHealth } = useConfigurationContext()

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

  const HeartbeatIcon: FunctionComponent<TabBarIconProps> = ({
    focused,
    size,
  }) => {
    const tabIcon = (
      <TabIcon
        icon={TabBarIcons.Heartbeat}
        label={t("navigation.symptom_checker")}
        focused={focused}
        size={size}
      />
    )
    return tabIcon
  }

  const ConnectIcon: FunctionComponent<TabBarIconProps> = ({
    focused,
    size,
  }) => {
    const tabIcon = (
      <TabIcon
        icon={TabBarIcons.PersonInHand}
        label={t("navigation.connect")}
        focused={focused}
        size={size}
      />
    )
    return tabIcon
  }

  const tabBarOptions = {
    showLabel: false,
    style: {
      backgroundColor: Colors.primaryLightBackground,
      borderTopWidth: 1,
      borderTopColor: Colors.neutral10,
      height: insets.bottom + 60,
    },
  }

  return (
    <Tab.Navigator tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name={Stacks.Home}
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
      {displayMyHealth && (
        <Tab.Screen
          name={Stacks.MyHealth}
          component={MyHealthStack}
          options={{
            tabBarLabel: t("navigation.symptom_checker"),
            tabBarIcon: HeartbeatIcon,
          }}
        />
      )}
      <Tab.Screen
        name={Stacks.Connect}
        component={ConnectStack}
        options={{
          tabBarLabel: t("navigation.connect"),
          tabBarIcon: ConnectIcon,
        }}
      />
    </Tab.Navigator>
  )
}

export default MainTabNavigator
