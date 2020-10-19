import React, { FunctionComponent, ReactNode } from "react"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SvgXml } from "react-native-svg"

import { Icons } from "../assets"
import {
  Colors,
  Iconography,
  Typography,
  Spacing,
  Layout,
  Outlines,
} from "../styles"

interface ModalHeaderProps {
  headerTitle: string
}

export const applyModalHeader = (headerTitle: string) => {
  return function modalHeader(): ReactNode {
    return <ModalHeader headerTitle={headerTitle} />
  }
}

const ModalHeader: FunctionComponent<ModalHeaderProps> = ({ headerTitle }) => {
  const navigation = useNavigation()

  return (
    <View style={style.container}>
      <Text numberOfLines={10} style={style.headerText}>
        {headerTitle}
      </Text>
      <TouchableOpacity
        onPress={navigation.goBack}
        hitSlop={{ top: 30, right: 30, bottom: 30, left: 30 }}
      >
        <SvgXml
          xml={Icons.XInCircle}
          fill={Colors.neutral50}
          width={Iconography.small}
          height={Iconography.small}
        />
      </TouchableOpacity>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.massive,
    paddingBottom: Spacing.small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary10,
    borderBottomWidth: Outlines.hairline,
    borderColor: Colors.neutral10,
  },
  headerText: {
    ...Typography.header2,
    color: Colors.primaryText,
    maxWidth: Layout.screenWidth * 0.75,
  },
})
