import React, { useEffect, useState } from "react"
import {
  Alert,
  BackHandler,
  FlatList,
  StyleSheet,
  View,
  Text,
  NativeModules,
} from "react-native"

import { RTLEnabledText } from "../components/RTLEnabledText"
import { NavigationProp } from "../navigation"

import dayjs from "dayjs"
import { RawExposure } from "../gaen/dataConverters"

import { Typography } from "../styles"

type ENLocalExposureScreenProp = {
  navigation: NavigationProp
}

type DebugExposure = {
  id: string
  date: string
}

const ExposureListDebugScreen = ({
  navigation,
}: ENLocalExposureScreenProp): JSX.Element => {
  const initialExposures: DebugExposure[] = []

  const fetchExposures = async () => {
    try {
      NativeModules.ExposureHistoryModule.getCurrentExposures(
        (debugExposure: string) => {
          const rawExposures: RawExposure[] = JSON.parse(debugExposure)
          const debugExposures: DebugExposure[] = rawExposures.map((e) => {
            return { id: e.id, date: dayjs(e.date).toString() }
          })
          setExposures(debugExposures)
        },
      )
      setExposures(exposures)
    } catch (e) {
      setErrorMessage(e.message)
    }
  }

  const [exposures, setExposures] = useState<DebugExposure[]>(initialExposures)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (errorMessage) {
      showErrorAlert(errorMessage)
    }
    const handleBackPress = () => {
      navigation.goBack()
      return true
    }

    BackHandler.addEventListener("hardwareBackPress", handleBackPress)

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress)
    }
  }, [navigation, exposures, errorMessage])

  useEffect(() => {
    fetchExposures()
  })

  const showErrorAlert = (errorMessage: string) => {
    Alert.alert("Error", errorMessage, [{ text: "OK" }], {
      cancelable: false,
    })
  }

  return (
    <FlatList
      data={exposures}
      keyExtractor={(item) => item.id}
      renderItem={(item) => (
        <View style={style.flatlistRowView}>
          <RTLEnabledText style={style.itemText}>
            <Text>Date: {item.item.date}</Text>
          </RTLEnabledText>
        </View>
      )}
    />
  )
}

const style = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  flatlistRowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 7,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#999999",
  },
  itemText: {
    ...Typography.tertiaryContent,
    padding: 10,
    maxWidth: "90%",
  },
})

export default ExposureListDebugScreen
