import React, { FunctionComponent, ReactNode } from "react"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SvgXml } from "react-native-svg"

import { Icons } from "../assets"
import { Colors, Iconography, Typography, Spacing, Layout } from "../styles"

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
          xml={Icons.X}
          fill={Colors.black}
          width={Iconography.xxSmall}
          height={Iconography.xxSmall}
        />
      </TouchableOpacity>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: Spacing.massive,
    padding: Spacing.large,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
  },
  headerText: {
    ...Typography.header1,
    color: Colors.primary125,
    maxWidth: Layout.screenWidth * 0.75,
  },
})
