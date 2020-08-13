import React, { FunctionComponent } from "react"
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { useStatusBarEffect } from "../navigation"
import { SvgXml } from "react-native-svg"

import { getLocaleList, setUserLocaleOverride } from "../locales/languages"
import { GlobalText } from "../components/GlobalText"
import { Icons } from "../assets"

import {
  Outlines,
  Layout,
  Iconography,
  Colors,
  Spacing,
  Typography,
} from "../styles"

const LanguageSelection: FunctionComponent = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation()
  const navigation = useNavigation()
  useStatusBarEffect("light-content")
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
    const languageButtonTextStyle = languageIsSelected
      ? { ...Typography.bold, color: Colors.primaryText }
      : null
    const languageButtonTextStyles = {
      ...style.languageButtonText,
      ...languageButtonTextStyle,
    }

    return (
      <TouchableOpacity
        style={style.languageButton}
        onPress={handleOnSelectLanguage}
      >
        <GlobalText style={languageButtonTextStyles}>{item.label}</GlobalText>
      </TouchableOpacity>
    )
  }

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <GlobalText style={style.headerText}>
          {t("onboarding.select_language")}
        </GlobalText>
        <TouchableOpacity
          style={style.closeIconContainer}
          onPress={navigation.goBack}
        >
          <SvgXml
            xml={Icons.XInCircle}
            fill={Colors.lighterGray}
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
        backgroundColor: Colors.lighterGray,
        height: Outlines.hairline,
        width: "100%",
      }}
    />
  )
}

const headerHeight = 70

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  headerContainer: {
    position: "absolute",
    height: headerHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: Colors.faintGray,
    zIndex: Layout.zLevel1,
  },
  headerText: {
    flex: 10,
    ...Typography.header3,
    paddingHorizontal: Spacing.large,
    color: Colors.primaryViolet,
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
    ...Typography.mainContent,
  },
})

export default LanguageSelection
