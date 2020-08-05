import React from "react"
import {
  FlatList,
  View,
  StyleSheet,
  TouchableHighlight,
  SafeAreaView,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { useStatusBarEffect } from "../navigation"

import { getLocaleList, setUserLocaleOverride } from "../locales/languages"
import { GlobalText } from "../components/GlobalText"

import { Colors, Spacing, Typography } from "../styles"

const Separator = () => (
  <View
    style={{
      backgroundColor: Colors.primaryBorder,
      height: StyleSheet.hairlineWidth,
      width: "100%",
    }}
  />
)

const LanguageSelection = (): JSX.Element => {
  const {
    i18n: { language },
  } = useTranslation()
  const navigation = useNavigation()
  useStatusBarEffect("dark-content")
  const localeList = getLocaleList()

  const onSelectLanguage = (locale: string) => {
    setUserLocaleOverride(locale)
    navigation.goBack()
  }

  return (
    <SafeAreaView>
      <FlatList
        keyExtractor={(_, i) => `${i}`}
        data={localeList}
        renderItem={({ item: { value, label } }) => (
          <TouchableHighlight
            underlayColor={Colors.underlayPrimaryBackground}
            style={{
              paddingVertical: Spacing.medium,
              paddingHorizontal: Spacing.large,
            }}
            onPress={() => onSelectLanguage(value)}
          >
            <GlobalText
              style={{
                ...Typography.mainContent,
                fontWeight: language === value ? "700" : "500",
              }}
            >
              {label}
            </GlobalText>
          </TouchableHighlight>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
    </SafeAreaView>
  )
}

export default LanguageSelection
