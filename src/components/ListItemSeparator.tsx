import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"

import { Outlines } from "../styles"

const ListItemSeparator: FunctionComponent = () => {
  return <View style={style.separator} />
}

const style = StyleSheet.create({
  separator: {
    ...Outlines.separatorLine,
  },
})

export default ListItemSeparator
