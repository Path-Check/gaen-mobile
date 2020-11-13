import React, { FunctionComponent } from "react"
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

import { Colors, Iconography, Outlines, Spacing, Typography } from "../styles"
import { TouchableOpacity } from "react-native-gesture-handler"
import { View } from "react-native"

const Tab = createBottomTabNavigator()

const MainTabNavigator: FunctionComponent = () => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { displaySymptomHistory } = useConfigurationContext()

  interface TabIconProps extends TabBarIconProps {
    icon: string
  }

  const TabIcon: FunctionComponent<TabIconProps> = ({ focused, icon }) => {
    return (
      <SvgXml
        xml={icon}
        fill={focused ? Colors.primary.shade100 : Colors.neutral.shade50}
        width={22}
        height={22}
      />
    )
  }

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

  interface TabBarLabelProps {
    focused: boolean
    color: string
    label: string
  }

  const TabBarLabel: FunctionComponent<TabBarLabelProps> = ({
    focused,
    label,
  }) => {
    const color = focused ? Colors.primary.shade100 : Colors.neutral.shade100

    return (
      <Text
        allowFontScaling={false}
        numberOfLines={2}
        ellipsizeMode="middle"
        style={{
          ...Typography.style.normal,
          fontSize: Typography.size.x15,
          color: color,
          textAlign: "center",
          lineHeight: Typography.lineHeight.x5,
        }}
      >
        {label}
      </Text>
    )
  }

  const tabBarOptions = {
    style: {
      backgroundColor: Colors.background.primaryLight,
      borderTopWidth: 1,
      borderTopColor: Colors.neutral.shade10,
      height: insets.bottom + 60,
    },
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
          justifyContent: "space-between",
          paddingHorizontal: Spacing.large,
          paddingBottom: insets.bottom,
          paddingTop: Spacing.xxSmall,
          backgroundColor: Colors.background.primaryLight,
          borderTopWidth: Outlines.hairline,
          borderColor: Colors.neutral.shade10,
        }}
      >
        {state.routes.map((route, index: number) => {
          const { options } = descriptors[route.key]

          const label = options.tabBarLabel
          const icon = options.tabBarIcon
          const focused = state.index === index

          const handleOnPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const textColor = focused
            ? Colors.primary.shade100
            : Colors.neutral.shade100

          if (icon === undefined) {
            return
          }

          return (
            <TouchableOpacity
              onPress={handleOnPress}
              style={{ alignItems: "center" }}
              accessibilityRole="button"
              key={index}
            >
              <View style={{ marginBottom: Spacing.xxSmall }}>
                {icon({ focused, color: "", size: 0 })}
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
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      tabBarOptions={tabBarOptions}
    >
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
      {displaySymptomHistory ||
        (true && (
          <Tab.Screen
            name={Stacks.SymptomHistory}
            component={SymptomHistoryStack}
            options={{
              tabBarLabel: t("navigation.symptom_history"),
              tabBarIcon: HeartbeatIcon,
            }}
          />
        ))}
      <Tab.Screen
        name={Stacks.Settings}
        component={SettingsStack}
        options={{
          tabBarLabel: t("navigation.settings"),
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tab.Navigator>
  )
}

export default MainTabNavigator
