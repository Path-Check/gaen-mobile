import React, { FunctionComponent } from "react"
import { View, StyleSheet, Text } from "react-native"

const NoExposures: FunctionComponent = () => {
  return (
    <View style={styles.container}>
      <Text>No Exposure Reports</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default NoExposures
