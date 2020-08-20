import React, { useEffect, useState } from "react"
import {
  View,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  ScrollView,
  ActivityIndicator,
} from "react-native"

import { GlobalText } from "../components/GlobalText"
import { useOnboardingContext } from "../OnboardingContext"
import { NativeModule } from "../gaen"
import { NavigationProp, Screens } from "../navigation"

import { Colors, Spacing, Typography, Outlines } from "../styles"

type ENDebugMenuProps = {
  navigation: NavigationProp
}

const ENDebugMenu = ({ navigation }: ENDebugMenuProps): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const { resetOnboarding } = useOnboardingContext()

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack()
      return true
    }

    BackHandler.addEventListener("hardwareBackPress", handleBackPress)

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress)
    }
  }, [navigation])

  const showErrorAlert = (errorString: string) => {
    Alert.alert("Error", errorString, [{ text: "OK" }], {
      cancelable: false,
    })
  }

  const showSuccessAlert = (messageString: string) => {
    Alert.alert(
      "Success",
      messageString,
      [
        {
          text: "OK",
        },
      ],
      { cancelable: false },
    )
  }

  const handleOnPressSimulationButton = (
    callSimulatedEvent: () => Promise<string>,
  ) => {
    return async () => {
      try {
        setLoading(true)
        const result = await callSimulatedEvent()
        setLoading(false)
        showSuccessAlert(result)
      } catch (e) {
        setLoading(false)
        showErrorAlert(e.message)
      }
    }
  }

  const handleOnPressRestartOnboarding = () => {
    resetOnboarding()
  }

  interface DebugMenuListItemProps {
    label: string
    onPress: () => void
    itemStyle?: ViewStyle
  }

  const DebugMenuListItem = ({
    label,
    onPress,
    itemStyle,
  }: DebugMenuListItemProps) => {
    return (
      <TouchableOpacity style={[style.listItem, itemStyle]} onPress={onPress}>
        <GlobalText style={style.listItemText}>{label}</GlobalText>
      </TouchableOpacity>
    )
  }

  return (
    <>
      {loading ? (
        <View style={style.loadingIndicator}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <ScrollView>
          <View style={style.section}>
            <DebugMenuListItem
              label="Simulate Exposure"
              onPress={handleOnPressSimulationButton(
                NativeModule.simulateExposure,
              )}
            />
            <DebugMenuListItem
              label="Show Last Processed File Path"
              onPress={handleOnPressSimulationButton(
                NativeModule.showLastProcessedFilePath,
              )}
            />
            <DebugMenuListItem
              label="Show Local Diagnosis Keys"
              onPress={() => {
                navigation.navigate(Screens.ENLocalDiagnosisKey)
              }}
            />
            <DebugMenuListItem
              label="Force App Crash"
              onPress={() => {
                NativeModule.forceAppCrash()
              }}
            />
            <DebugMenuListItem
              label="Restart Onboarding"
              onPress={handleOnPressRestartOnboarding}
            />
          </View>
          {__DEV__ ? (
            <View style={style.section}>
              <DebugMenuListItem
                label="Show Exposures"
                onPress={() => {
                  navigation.navigate(Screens.ExposureListDebugScreen)
                }}
              />
              <DebugMenuListItem
                label="Toggle Exposure Notifications"
                onPress={handleOnPressSimulationButton(
                  NativeModule.toggleExposureNotifications,
                )}
              />
              <DebugMenuListItem
                label="Detect Exposures Now"
                onPress={handleOnPressSimulationButton(
                  NativeModule.detectExposuresNow,
                )}
              />
              <DebugMenuListItem
                label="Reset Exposures"
                itemStyle={style.lastListItem}
                onPress={handleOnPressSimulationButton(
                  NativeModule.resetExposures,
                )}
              />
              <DebugMenuListItem
                label="Simulate Exposure Detection Error"
                onPress={handleOnPressSimulationButton(
                  NativeModule.simulateExposureDetectionError,
                )}
              />
            </View>
          ) : null}
        </ScrollView>
      )}
    </>
  )
}

const style = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
    paddingHorizontal: Spacing.small,
    marginBottom: Spacing.medium,
    borderTopWidth: Outlines.hairline,
    borderBottomWidth: Outlines.hairline,
    borderColor: Colors.secondary75,
  },
  listItem: {
    flex: 1,
    paddingVertical: Spacing.medium,
    borderBottomWidth: Outlines.hairline,
    borderColor: Colors.secondary75,
  },
  listItemText: {
    ...Typography.mainContent,
  },
  lastListItem: {
    borderBottomWidth: 0,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
  },
})

export default ENDebugMenu
