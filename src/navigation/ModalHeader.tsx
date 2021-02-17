import React, { FunctionComponent, ReactNode } from "react"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"

import { Icons } from "../assets"
import {
  Colors,
  Iconography,
  Typography,
  Spacing,
  Layout,
  Outlines,
} from "../styles"

export const applyModalHeader = (
  headerTitle: string,
  handleOnDismiss?: () => void,
) => {
  return function modalHeader(): ReactNode {
    return (
      <ModalHeader
        headerTitle={headerTitle}
        handleOnDismiss={handleOnDismiss}
      />
    )
  }
}

interface ModalHeaderProps {
  headerTitle: string
  handleOnDismiss?: () => void
}

const ModalHeader: FunctionComponent<ModalHeaderProps> = ({
  headerTitle,
  handleOnDismiss,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

  const handleOnPressBack = () => {
    if (handleOnDismiss) {
      handleOnDismiss()
    } else {
      navigation.goBack()
    }
  }

  return (
    <View accessibilityLabel={"header"} style={style.container}>
      <Text
        numberOfLines={10}
        style={style.headerText}
        accessible
        allowFontScaling={false}
      >
        {headerTitle}
      </Text>
      <TouchableOpacity
        onPress={handleOnPressBack}
        hitSlop={{ top: 30, right: 30, bottom: 30, left: 30 }}
        accessibilityLabel={t("common.close_screen")}
      >
        <SvgXml
          xml={Icons.XInCircle}
          fill={Colors.neutral.shade50}
          width={Iconography.small}
          height={Iconography.small}
        />
      </TouchableOpacity>
    </View>
  )
}

const createStyle = (insets: EdgeInsets) => {
  /* eslint-disable react-native/no-unused-styles */
  return StyleSheet.create({
    container: {
      width: "100%",
      paddingHorizontal: Spacing.large,
      paddingTop: insets.top + Spacing.large,
      paddingBottom: Spacing.small,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.secondary.shade10,
      borderBottomWidth: Outlines.hairline,
      borderColor: Colors.neutral.shade10,
    },
    headerText: {
      ...Typography.header.x50,
      color: Colors.text.primary,
      maxWidth: Layout.screenWidth * 0.75,
    },
  })
}
