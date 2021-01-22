import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import WebView from "react-native-webview"

import { useConfigurationContext } from "../ConfigurationContext"
import { useStatusBarEffect } from "../navigation"
import { Text } from "../components"

import { Colors } from "../styles"

const CovidDataWebView: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)
  const { healthAuthorityCovidDataWebViewUrl: url } = useConfigurationContext()

  if (!url) {
    return (
      <View style={style.container}>
        <Text>Url for WebView source is null</Text>
      </View>
    )
  }

  return <WebView source={{ uri: url }} />
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default CovidDataWebView
