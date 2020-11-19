import React, { FunctionComponent, useEffect, useRef } from "react"
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  findNodeHandle,
  AccessibilityInfo,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { enabledLocales, setUserLocaleOverride } from "../locales/languages"
import { Locale } from "../locales/locale"
import { Text } from "../components"
import { useStatusBarEffect } from "../navigation"

import { Outlines, Colors, Spacing, Typography } from "../styles"

const LanguageSelection: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)
  const {
    i18n: { language },
  } = useTranslation()
  const navigation = useNavigation()
  const localeList = enabledLocales()

  type ListItem = {
    label: string
    value: Locale
  }

  interface LanguageListItemProps {
    item: ListItem
    index: number
  }

  const LanguageListItem: FunctionComponent<LanguageListItemProps> = ({
    item,
    index,
  }) => {
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

    const LanguageButtonText = () => {
      return <Text style={languageButtonTextStyles}>{item.label}</Text>
    }

    const firstLanguageButton = useRef(null)

    const LanguageButton = () => {
      return (
        <TouchableOpacity
          style={style.languageButton}
          onPress={handleOnSelectLanguage}
        >
          <LanguageButtonText />
        </TouchableOpacity>
      )
    }

    const LanguageButtonWithRef = () => {
      return (
        <TouchableOpacity
          style={style.languageButton}
          onPress={handleOnSelectLanguage}
          ref={firstLanguageButton}
        >
          <LanguageButtonText />
        </TouchableOpacity>
      )
    }

    useEffect(() => {
      if (firstLanguageButton && firstLanguageButton.current) {
        const reactTag = findNodeHandle(firstLanguageButton.current)
        if (reactTag) {
          /* Accessibility focus is only set if this function is called three
           times in a row. See issue:
           https://github.com/facebook/react-native/issues/30097 */
          AccessibilityInfo.setAccessibilityFocus(reactTag)
          AccessibilityInfo.setAccessibilityFocus(reactTag)
          AccessibilityInfo.setAccessibilityFocus(reactTag)
        }
      }
    }, [])

    const isFirstLanguageButton = index === 0

    if (isFirstLanguageButton) {
      return <LanguageButtonWithRef />
    } else {
      return <LanguageButton />
    }
  }

  const renderItem = ({ item, index }: { item: ListItem; index: number }) => {
    return <LanguageListItem item={item} index={index} />
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
    ...Typography.button.listItem,
  },
  languageButtonTextSelected: {
    ...Typography.style.semibold,
  },
})

export default LanguageSelection
