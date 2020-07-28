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

import { RTLEnabledText } from "../components/RTLEnabledText"
import { NativeModule } from "../gaen"
import { NavigationProp, Screens } from "../navigation"

import { Colors, Spacing, Typography } from "../styles"

type ENDebugMenuProps = {
  navigation: NavigationProp
}

const ENDebugMenu = ({ navigation }: ENDebugMenuProps): JSX.Element => {
  const [loading, setLoading] = useState(false)
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
  interface DebugMenuListItemProps {
    label: string
    onPress: () => void
    style?: ViewStyle
  }

  const DebugMenuListItem = ({
    label,
    onPress,
    style,
  }: DebugMenuListItemProps) => {
    return (
      <TouchableOpacity style={[styles.listItem, style]} onPress={onPress}>
        <RTLEnabledText style={{ ...Typography.mainContent }}>
          {label}
        </RTLEnabledText>
      </TouchableOpacity>
    )
  }

  return (
    <>
      {loading ? (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.section}>
            <DebugMenuListItem
              label="Show Last Processed File Path"
              onPress={handleOnPressSimulationButton(
                NativeModule.showLastProcessedFilePath,
              )}
            />
            <DebugMenuListItem
              label="Show Exposures"
              onPress={() => {
                navigation.navigate(Screens.ExposureListDebugScreen)
              }}
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
              label="Submit Debug Log"
              onPress={() => {
                navigation.navigate(Screens.ENSubmitDebugForm)
              }}
            />
          </View>
          {__DEV__ ? (
            <View style={styles.section}>
              <DebugMenuListItem
                label="Simulate Exposure"
                onPress={handleOnPressSimulationButton(
                  NativeModule.simulateExposure,
                )}
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
                style={styles.lastListItem}
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

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.small,
    marginBottom: Spacing.medium,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.tertiaryViolet,
  },
  listItem: {
    flex: 1,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderColor: Colors.tertiaryViolet,
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
