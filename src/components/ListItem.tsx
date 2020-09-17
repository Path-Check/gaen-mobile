import React, { FunctionComponent } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { SvgXml } from "react-native-svg"

import GlobalText from "./GlobalText"

import { Iconography, Spacing, Typography, Colors } from "../styles"

interface ListItemProps {
  label: string
  onPress: () => void
  icon: string
}

const ListItem: FunctionComponent<ListItemProps> = ({
  label,
  onPress,
  icon,
}) => {
  return (
    <TouchableOpacity onPress={onPress} accessible accessibilityLabel={label}>
      <View style={style.listItem}>
        <SvgXml
          fill={Colors.primary100}
          xml={icon}
          width={Iconography.small}
          height={Iconography.small}
          style={style.icon}
          accessible
          accessibilityLabel={label}
        />
        <GlobalText style={style.listItemText}>{label}</GlobalText>
      </View>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  icon: {
    marginRight: Spacing.small,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.large,
  },
  listItemText: {
    ...Typography.tappableListItem,
  },
})

export default ListItem
