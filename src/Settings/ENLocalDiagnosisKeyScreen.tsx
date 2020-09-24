import React, { FunctionComponent, useEffect, useState } from "react"
import {
  Alert,
  BackHandler,
  FlatList,
  StyleSheet,
  View,
  Text,
} from "react-native"

import { GlobalText } from "../components"
import { NavigationProp } from "../navigation"

import { NativeModule } from "../gaen"

import { Typography } from "../styles"

export type ENDiagnosisKey = {
  id: string
  rollingStartNumber: number
}

type ENLocalDiagnosisKeyScreenProp = {
  navigation: NavigationProp
}

const ENLocalDiagnosisKeyScreen: FunctionComponent<ENLocalDiagnosisKeyScreenProp> = ({
  navigation,
}) => {
  const initialKeys: ENDiagnosisKey[] = []

  const fetchDiagnosisKeys = async () => {
    try {
      const keys = await NativeModule.fetchDiagnosisKeys()
      setDiagnosisKeys(keys)
    } catch (e) {
      setErrorMessage(e.message)
    }
  }

  const [diagnosisKeys, setDiagnosisKeys] = useState<ENDiagnosisKey[]>(
    initialKeys,
  )

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
  }, [navigation, diagnosisKeys, errorMessage])

  useEffect(() => {
    fetchDiagnosisKeys()
  }, [])

  const showErrorAlert = (errorMessage: string) => {
    Alert.alert("Error", errorMessage, [{ text: "OK" }], {
      cancelable: false,
    })
  }

  return (
    <FlatList
      data={diagnosisKeys}
      keyExtractor={(item) => item.id}
      renderItem={(item) => (
        <View style={style.flatlistRowView}>
          <GlobalText style={style.itemText}>
            <Text>Rolling start number: {item.item.rollingStartNumber}</Text>
          </GlobalText>
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
    ...Typography.body1,
    padding: 10,
    maxWidth: "90%",
  },
})

export default ENLocalDiagnosisKeyScreen
