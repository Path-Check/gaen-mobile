import React, { FunctionComponent, useCallback, useEffect } from "react"
import { FlatList, StyleSheet, View } from "react-native"

import { Text } from "../components"

import dayjs from "dayjs"

import { Typography, Spacing, Outlines, Colors } from "../styles"
import { useExposureContext } from "../ExposureContext"

const ExposureListDebugScreen: FunctionComponent = () => {
  const { exposureInfo, refreshExposureInfo } = useExposureContext()
  const exposures = exposureInfo.map((e) => {
    return {
      id: e.id,
      date: dayjs(e.date).toString(),
      duration: e.duration,
    }
  })
  const showExposures = exposures.length > 0

  useEffect(
    useCallback(() => {
      refreshExposureInfo()
    }, [refreshExposureInfo]),
  )

  return (
    <>
      {showExposures ? (
        <FlatList
          data={exposures}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              testID={"exposure-list-debug-item"}
              style={style.flatlistRowView}
            >
              <Text style={style.itemText}>Date: {item.date}</Text>
              <Text style={style.itemText}>
                Duration (seconds): {item.duration}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={style.noExposureText}>No exposure data to display</Text>
      )}
    </>
  )
}

const style = StyleSheet.create({
  flatlistRowView: {
    justifyContent: "space-between",
    paddingTop: Spacing.xxxSmall,
    paddingBottom: Spacing.xxxSmall,
    borderBottomWidth: Outlines.hairline,
    borderColor: Colors.neutral.shade75,
  },
  itemText: {
    ...Typography.body.x30,
    padding: Spacing.xSmall,
    maxWidth: "90%",
  },
  noExposureText: {
    ...Typography.header.x20,
    padding: Spacing.medium,
  },
})

export default ExposureListDebugScreen
