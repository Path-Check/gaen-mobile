import React, { FunctionComponent } from "react"
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { getLocaleList, setUserLocaleOverride } from "../locales/languages"
import { Text } from "../components"
import { useStatusBarEffect } from "../navigation"

import { Outlines, Colors, Spacing, Typography } from "../styles"

const LanguageSelection: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)
  const {
    i18n: { language },
  } = useTranslation()
  const navigation = useNavigation()
  const localeList = getLocaleList()

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
      <FlatList
        keyExtractor={(_, i) => `${i}`}
        data={localeList}
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListFooterComponent={itemSeparatorComponent}
        alwaysBounceVertical={false}
      />
    </View>
  )
}

const itemSeparatorComponent = () => {
  return (
    <View
      style={{
        backgroundColor: Colors.neutral.shade30,
        height: Outlines.hairline,
        width: "100%",
      }}
    />
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
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

export default LanguageSelection
