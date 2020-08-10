import React, { FunctionComponent } from "react"
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  ImageSourcePropType,
  ViewStyle,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { GlobalText } from "../components/GlobalText"

import { Typography, Spacing, Colors } from "../styles"

const ProtectPrivacy: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <GlobalText style={style.headerText}>
          {t("onboarding.how_protect_privacy")}
        </GlobalText>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  headerContainer: {
    backgroundColor: Colors.primaryBlue,
    paddingVertical: Spacing.xxLarge,
    paddingHorizontal: Spacing.large,
  },
  headerText: {
    ...Typography.header2,
    color: Colors.invertedText,
  },
})

export default ProtectPrivacy
