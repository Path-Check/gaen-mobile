import React, { FunctionComponent } from "react"
import { View, Text, Switch, StyleSheet } from "react-native"
import { Colors, Spacing, Typography } from "../styles"

type SwitchListItemProps = {
  label: string
  isActive: boolean
  onChange: () => void
  testID: string
}

const SwitchListItem: FunctionComponent<SwitchListItemProps> = ({
  label,
  isActive,
  onChange,
  testID,
}) => {
  return (
    <View style={style.toggleContainer}>
      <Text style={style.toggleText}>{label}</Text>
      <Switch
        onValueChange={onChange}
        value={isActive}
        trackColor={{
          true: Colors.accent.success100,
          false: Colors.neutral.white,
        }}
        testID={testID}
      />
    </View>
  )
}

const style = StyleSheet.create({
  toggleContainer: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.large,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleText: {
    ...Typography.tappableListItem,
  },
})

export default SwitchListItem
