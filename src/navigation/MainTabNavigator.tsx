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
import { TabRoute, TabRoutes } from "./index"
import { TabBarIcons } from "../assets/svgs/TabBarNav"
import { Text } from "../components"

import { Colors, Layout, Outlines, Spacing, Typography } from "../styles"

type Tab = {
  name: TabRoute
  component: FunctionComponent
}

const MainTabNavigator: FunctionComponent = () => {
  const { displaySymptomHistory } = useConfigurationContext()

  const homeTab = {
    name: TabRoutes.Home,
    component: HomeStack,
  }
  const exposureHistoryTab = {
    name: TabRoutes.ExposureHistory,
    component: ExposureHistoryStack,
  }
  const symptomHistoryTab = {
    name: TabRoutes.SymptomHistory,
    component: SymptomHistoryStack,
  }
  const settingsTab = {
    name: TabRoutes.Settings,
    component: SettingsStack,
  }

  const tabs: Tab[] = displaySymptomHistory
    ? [homeTab, exposureHistoryTab, symptomHistoryTab, settingsTab]
    : [homeTab, exposureHistoryTab, settingsTab]

  const TabNavigator = createBottomTabNavigator()

  return (
    <TabNavigator.Navigator
      tabBar={(props) => <TabBar {...props} tabs={tabs} />}
    >
      {tabs.map(({ name, component }) => {
        return (
          <TabNavigator.Screen name={name} component={component} key={name} />
        )
      })}
    </TabNavigator.Navigator>
  )
}

type TabBarProps = BottomTabBarProps & { tabs: Tab[] }

const TabBar: FunctionComponent<TabBarProps> = ({
  state,
  navigation,
  tabs,
}) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

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
        const handleOnPress = () => {
          !isFocused && navigation.navigate(route.name)
        }

        const isFocused = state.index === index

        const textColor = isFocused
          ? Colors.primary.shade100
          : Colors.neutral.shade100

        const routeStringToTab = (route: string): TabRoute => {
          switch (route) {
            case "Home": {
              return "Home"
            }
            case "ExposureHistory": {
              return "ExposureHistory"
            }
            case "SymptomHistory": {
              return "SymptomHistory"
            }
            case "Settings": {
              return "Settings"
            }
            default: {
              return "Home"
            }
          }
        }

        const currentTab = routeStringToTab(route.name)

        type TabButtonConfig = {
          label: string
          icon: string
        }

        const determineConfig = (): TabButtonConfig => {
          switch (currentTab) {
            case "Home": {
              return {
                label: t("navigation.home"),
                icon: TabBarIcons.House,
              }
            }
            case "ExposureHistory": {
              return {
                label: t("navigation.exposure_history"),
                icon: TabBarIcons.Exposure,
              }
            }
            case "SymptomHistory": {
              return {
                label: t("navigation.symptom_history"),
                icon: TabBarIcons.Heartbeat,
              }
            }
            case "Settings": {
              return {
                label: t("navigation.settings"),
                icon: TabBarIcons.Gear,
              }
            }
          }
        }

        const { label, icon } = determineConfig()

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
            <TabIcon focused={isFocused} icon={icon} />
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

interface TabIconProps {
  focused: boolean
  icon: string
}

const TabIcon: FunctionComponent<TabIconProps> = ({ focused, icon }) => {
  const iconSize = 22

  return (
    <View style={{ marginBottom: Spacing.xxSmall }}>
      <SvgXml
        xml={icon}
        fill={focused ? Colors.primary.shade100 : Colors.neutral.shade50}
        width={iconSize}
        height={iconSize}
      />
    </View>
  )
}

export default MainTabNavigator
