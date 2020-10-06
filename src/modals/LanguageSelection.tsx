import React, { FunctionComponent } from "react"
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"

import { getLocaleList, setUserLocaleOverride } from "../locales/languages"
import { Text } from "../components"
import { Icons } from "../assets"
import { useStatusBarEffect } from "../navigation"

import {
  Outlines,
  Layout,
  Iconography,
  Colors,
  Spacing,
  Typography,
} from "../styles"

const LanguageSelection: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const {
    i18n: { language },
    t,
  } = useTranslation()
  const navigation = useNavigation()
  const localeList = getLocaleList()
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

  type ListItem = {
    label: string
    value: string
  }

  const renderItem = ({ item }: { item: ListItem }) => {
    const handleOnSelectLanguage = () => {
      setUserLocaleOverride(item.value)
      navigation.goBack()
    }

    const languageIsSelected = language === item.value
    const languageButtonTextStyle = languageIsSelected && {
      ...style.languageButtonTextSelected,
    }
    const languageButtonTextStyles = {
      ...style.languageButtonText,
      ...languageButtonTextStyle,
    }

    return (
      <TouchableOpacity
        style={style.languageButton}
        onPress={handleOnSelectLanguage}
      >
        <Text style={languageButtonTextStyles}>{item.label}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>{t("onboarding.select_language")}</Text>
        <TouchableOpacity
          style={style.closeIconContainer}
          onPress={navigation.goBack}
        >
          <SvgXml
            xml={Icons.XInCircle}
            fill={Colors.neutral30}
            width={Iconography.small}
            height={Iconography.small}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        keyExtractor={(_, i) => `${i}`}
        data={localeList}
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListFooterComponent={itemSeparatorComponent}
        alwaysBounceVertical={false}
        style={style.languageButtonsContainer}
      />
    </View>
  )
}

const itemSeparatorComponent = () => {
  return (
    <View
      style={{
        backgroundColor: Colors.neutral30,
        height: Outlines.hairline,
        width: "100%",
      }}
    />
  )
}

const createStyle = (insets: EdgeInsets) => {
  const headerHeight = insets.top + Spacing.massive

  /* eslint-disable react-native/no-unused-styles */
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.primaryLightBackground,
    },
    headerContainer: {
      position: "absolute",
      height: headerHeight,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor: Colors.secondary10,
      zIndex: Layout.zLevel1,
    },
    headerText: {
      flex: 10,
      ...Typography.header2,
      paddingHorizontal: Spacing.large,
      color: Colors.primary125,
      paddingBottom: Spacing.xSmall,
    },
    closeIconContainer: {
      flex: 1,
      padding: Spacing.small,
    },
    languageButtonsContainer: {
      marginTop: headerHeight,
    },
    languageButton: {
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.large,
    },
    languageButtonText: {
      ...Typography.tappableListItem,
    },
    languageButtonTextSelected: {
      ...Typography.semiBold,
    },
  })
}

export default LanguageSelection
