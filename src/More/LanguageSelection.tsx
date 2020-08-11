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

  const onSelectLanguage = (locale: string) => {
    setUserLocaleOverride(locale)
    navigation.goBack()
  }

  type ListItem = {
    label: string
    value: string
  }

  const renderItem = ({ item }: { item: ListItem }) => {
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
        onPress={() => onSelectLanguage(item.value)}
      >
        <GlobalText style={languageButtonTextStyles}>{item.label}</GlobalText>
      </TouchableOpacity>
    )
  }

  const headerHeight = 70
  const headerContainerStyle = { height: headerHeight }
  const languageButtonContainerStyle = { marginTop: headerHeight }

  return (
    <View style={style.container}>
      <View style={[style.headerContainer, headerContainerStyle]}>
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
      <View style={languageButtonContainerStyle}>
        <FlatList
          keyExtractor={(_, i) => `${i}`}
          data={localeList}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Separator />}
        />
      </View>
    </View>
  )
}

const Separator = () => {
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

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  headerContainer: {
    position: "absolute",
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
  languageButton: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
  },
  languageButtonText: {
    ...Typography.mainContent,
  },
})

export default LanguageSelection
