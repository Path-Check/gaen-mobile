import React, { FunctionComponent } from "react"
import { Pressable, View, StyleSheet } from "react-native"
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
        ...style.tabBarContainer,
        paddingBottom: insets.bottom + Spacing.xxSmall,
      }}
    >
      {tabs.map((tab, index: number) => {
        const isFocused = (tab: Tab) => {
          const focusedRouteName = state.routeNames[state.index]
          return tab.name === focusedRouteName
        }

        const focused = isFocused(tab)

        const handleOnPress = () => {
          !focused && navigation.navigate(tab.name)
        }

        const textColor = focused
          ? Colors.primary.shade100
          : Colors.neutral.shade100

        type TabButtonConfig = {
          label: string
          icon: string
        }

        const determineConfig = (tab: Tab): TabButtonConfig => {
          switch (tab.name) {
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

        const { label, icon } = determineConfig(tab)

        return (
          <Pressable
            onPress={handleOnPress}
            style={{
              ...style.tabButton,
              width: (Layout.screenWidth / tabs.length) * 0.9,
            }}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            key={index}
          >
            <TabIcon focused={focused} icon={icon} />
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode="middle"
              style={{ ...style.tabLabelText, color: textColor }}
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
    <View style={style.tabIconContainer}>
      <SvgXml
        xml={icon}
        fill={focused ? Colors.primary.shade100 : Colors.neutral.shade50}
        width={iconSize}
        height={iconSize}
      />
    </View>
  )
}

const style = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.xxSmall,
    paddingHorizontal: Spacing.xSmall,
    backgroundColor: Colors.background.primaryLight,
    borderTopWidth: Outlines.hairline,
    borderColor: Colors.neutral.shade10,
  },
  tabButton: {
    alignItems: "center",
  },
  tabIconContainer: {
    marginBottom: Spacing.xxSmall,
  },
  tabLabelText: {
    ...Typography.style.normal,
    fontSize: Typography.size.x15,
    textAlign: "center",
    lineHeight: Typography.lineHeight.x5,
    maxWidth: Spacing.xxxMassive,
  },
})

export default MainTabNavigator
