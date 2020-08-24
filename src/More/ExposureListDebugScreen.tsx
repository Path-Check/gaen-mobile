import React, { useEffect, FunctionComponent } from "react"
import { FlatList, StyleSheet, View, Text } from "react-native"

import { GlobalText } from "../components/GlobalText"

import dayjs from "dayjs"

import { Typography, Spacing, Outlines, Colors } from "../styles"
import { useExposureContext } from "../ExposureContext"

const ExposureListDebugScreen: FunctionComponent = () => {
  const { exposureInfo, getCurrentExposures } = useExposureContext()
  const exposures = exposureInfo.map((e) => {
    return { id: e.id, date: dayjs(e.date).toString() }
  })
  const showExposures = exposures.length > 0

  useEffect(() => {
    getCurrentExposures()
  }, [])

  return (
    <>
      {showExposures ? (
        <FlatList
          data={exposures}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <View
              testID={"exposure-list-debug-item"}
              style={style.flatlistRowView}
            >
              <GlobalText style={style.itemText}>
                <Text>Date: {item.item.date}</Text>
              </GlobalText>
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
  // eslint-disable-next-line react-native/no-color-literals
  flatlistRowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.xxxSmall,
    paddingBottom: Spacing.xxxSmall,
    borderBottomWidth: Outlines.hairline,
    borderColor: Colors.neutral75,
  },
  itemText: {
    ...Typography.body1,
    padding: Spacing.xSmall,
    maxWidth: "90%",
  },
  noExposureText: {
    ...Typography.header5,
    padding: Spacing.medium,
  },
})

export default ExposureListDebugScreen
