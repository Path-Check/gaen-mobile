import React, { FunctionComponent } from "react"
import { Pressable, View } from "react-native"
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgXml } from "react-native-svg"

import ExposureHistoryStack from "./ExposureHistoryStack"
import HomeStack from "./HomeStack"
import SymptomHistoryStack from "./SymptomHistoryStack"
import SettingsStack from "./SettingsStack"
import { useConfigurationContext } from "../ConfigurationContext"
import { Stacks } from "./index"
import { TabBarIcons } from "../assets/svgs/TabBarNav"
import { Text } from "../components"

import { Colors, Layout, Outlines, Spacing, Typography } from "../styles"

const MainTabNavigator: FunctionComponent = () => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { displaySymptomHistory } = useConfigurationContext()

  interface TabBarIconProps {
    focused: boolean
  }

  const HomeIcon: FunctionComponent<TabBarIconProps> = ({ focused }) => {
    return <TabIcon icon={TabBarIcons.House} focused={focused} />
  }

  const ExposureHistoryIcon: FunctionComponent<TabBarIconProps> = ({
    focused,
  }) => {
    const tabIcon = <TabIcon icon={TabBarIcons.Exposure} focused={focused} />
    return tabIcon
  }

  const HeartbeatIcon: FunctionComponent<TabBarIconProps> = ({ focused }) => {
    const tabIcon = <TabIcon icon={TabBarIcons.Heartbeat} focused={focused} />
    return tabIcon
  }

  const SettingsIcon: FunctionComponent<TabBarIconProps> = ({ focused }) => {
    const tabIcon = <TabIcon icon={TabBarIcons.Gear} focused={focused} />
    return tabIcon
  }

  interface TabIconProps extends TabBarIconProps {
    icon: string
  }

  const TabIcon: FunctionComponent<TabIconProps> = ({ focused, icon }) => {
    const iconSize = 22

    return (
      <SvgXml
        xml={icon}
        fill={focused ? Colors.primary.shade100 : Colors.neutral.shade50}
        width={iconSize}
        height={iconSize}
      />
    )
  }

  type Tab_ = "home" | "exposureHistory" | "settings" | "symptomHistory"
  const tabs: Tab_[] = ["home", "exposureHistory", "settings"]
  if (displaySymptomHistory) {
    tabs.push("symptomHistory")
  }

  const TabBar: FunctionComponent<BottomTabBarProps> = ({
    state,
    descriptors,
    navigation,
  }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingBottom: insets.bottom + Spacing.xxSmall,
          paddingTop: Spacing.xxSmall,
          backgroundColor: Colors.background.primaryLight,
          borderTopWidth: Outlines.hairline,
          borderColor: Colors.neutral.shade10,
        }}
      >
        {state.routes.map((route, index: number) => {
          const { options } = descriptors[route.key]

          const label = options.title
          const icon = options.tabBarIcon
          const isFocused = state.index === index

          const handleOnPress = () => {
            !isFocused && navigation.navigate(route.name)
          }

          const textColor = isFocused
            ? Colors.primary.shade100
            : Colors.neutral.shade100

          if (icon === undefined) {
            return
          }

          return (
            <Pressable
              onPress={handleOnPress}
              style={{
                alignItems: "center",
                width: Layout.screenWidth / tabs.length,
              }}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              key={index}
            >
              <View style={{ marginBottom: Spacing.xxSmall }}>
                {icon({ focused: isFocused, color: "", size: 0 })}
              </View>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                ellipsizeMode="middle"
                style={{
                  ...Typography.style.normal,
                  fontSize: Typography.size.x15,
                  color: textColor,
                  textAlign: "center",
                  lineHeight: Typography.lineHeight.x5,
                  maxWidth: Spacing.xxxMassive,
                }}
              >
                {label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    )
  }

  const Tab = createBottomTabNavigator()

  return (
    <Tab.Navigator tabBar={TabBar}>
      <Tab.Screen
        name={Stacks.Home}
        component={HomeStack}
        options={{
          title: t("navigation.home"),
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name={Stacks.ExposureHistoryFlow}
        component={ExposureHistoryStack}
        options={{
          title: t("navigation.exposure_history"),
          tabBarIcon: ExposureHistoryIcon,
        }}
      />
      {displaySymptomHistory && (
        <Tab.Screen
          name={Stacks.SymptomHistory}
          component={SymptomHistoryStack}
          options={{
            title: t("navigation.symptom_history"),
            tabBarIcon: HeartbeatIcon,
          }}
        />
      )}
      <Tab.Screen
        name={Stacks.Settings}
        component={SettingsStack}
        options={{
          title: t("navigation.settings"),
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tab.Navigator>
  )
}

export default MainTabNavigator
