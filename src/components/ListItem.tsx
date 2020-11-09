import React, { FunctionComponent } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { SvgXml } from "react-native-svg"

import Text from "./Text"

import { Iconography, Spacing, Typography, Colors } from "../styles"

interface ListItemProps {
  label: string
  accessibilityLabel: string
  onPress: () => void
  icon: string
}

const ListItem: FunctionComponent<ListItemProps> = ({
  label,
  accessibilityLabel,
  onPress,
  icon,
}) => {
  return (
    <TouchableOpacity onPress={onPress} accessibilityLabel={accessibilityLabel}>
      <View style={style.listItem}>
        <SvgXml
          fill={Colors.primary.shade100}
          xml={icon}
          width={Iconography.small}
          height={Iconography.small}
          style={style.icon}
        />
        <Text style={style.listItemText}>{label}</Text>
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
    ...Typography.button.listItem,
  },
})

export default ListItem
