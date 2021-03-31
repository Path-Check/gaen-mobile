import React, { FunctionComponent } from "react"
import {
  Image,
  StyleSheet,
  Platform,
  View,
  ScrollView,
  ImageSourcePropType,
  TouchableOpacity,
  PixelRatio,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"
import { SvgXml } from "react-native-svg"

import { ModalStackScreens, useStatusBarEffect } from "../navigation"
import { Text } from "../components"

import { Colors, Spacing, Typography, Buttons, Layout } from "../styles"
import { Icons } from "../assets"

type HowItWorksScreenContent = {
  image: ImageSourcePropType
  imageLabel: string
  header: string
  primaryButtonLabel: string
  primaryButtonOnPress: () => void
}

interface HowItWorksScreenProps {
  howItWorksScreenContent: HowItWorksScreenContent
}

const HowItWorksScreen: FunctionComponent<HowItWorksScreenProps> = ({
  howItWorksScreenContent: {
    image,
    imageLabel,
    header,
    primaryButtonLabel,
    primaryButtonOnPress,
  },
}) => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

  const handleOnPressProtectPrivacy = () => {
    navigation.navigate(ModalStackScreens.ProtectPrivacy)
  }

  const imageHeight: () => number = () => {
    const size = PixelRatio.getPixelSizeForLayoutSize(10)
    if (size < 30) {
      return 220
    } else if (size < 32) {
      return 180
    } else {
      return 100
    }
  }

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View>
          <Image
            source={image}
            accessibilityLabel={imageLabel}
            accessible
            accessibilityRole="image"
            style={[style.image, { height: imageHeight() }]}
            resizeMode={"contain"}
          />
          <Text style={style.headerText}>{header}</Text>
        </View>
      </ScrollView>
      <View style={style.bottomButtonContainer}>
        <>
          <TouchableOpacity
            style={style.button}
            onPress={primaryButtonOnPress}
            accessibilityLabel={primaryButtonLabel}
            accessibilityRole="button"
            accessibilityHint={t("accessibility.hint.navigates_to_new_screen")}
          >
            <Text style={style.buttonText}>{primaryButtonLabel}</Text>
            <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOnPressProtectPrivacy}
            accessibilityLabel={t("onboarding.protect_privacy_button")}
            accessibilityRole="button"
            accessibilityHint={t("accessibility.hint.navigates_to_new_screen")}
          >
            <Text style={style.bottomButtonText}>
              {t("onboarding.protect_privacy_button")}
            </Text>
          </TouchableOpacity>
        </>
      </View>
    </>
  )
}

const createStyle = (insets: EdgeInsets) => {
  const iosPaddingTop = 65
  const androidPaddingTop = 90
  const headerHeight = Platform.select({
    ios: iosPaddingTop,
    android: Layout.screenHeight > 650 ? androidPaddingTop : 0,
    default: iosPaddingTop,
  })

  /* eslint-disable react-native/no-unused-styles */
  return StyleSheet.create({
    container: {
      backgroundColor: Colors.background.primaryLight,
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: "space-between",
      paddingTop: headerHeight + Spacing.medium,
      paddingBottom: Spacing.xxLarge,
      backgroundColor: Colors.background.primaryLight,
    },
    image: {
      width: "97%",
      marginBottom: Spacing.medium,
    },
    headerText: {
      ...Typography.header.x50,
      marginBottom: Spacing.xLarge,
      paddingHorizontal: Spacing.large,
    },
    button: {
      ...Buttons.thin.base,
      marginBottom: Spacing.small,
    },
    buttonText: {
      ...Typography.button.primary,
      marginRight: Spacing.small,
    },
    bottomButtonContainer: {
      alignItems: "center",
      paddingTop: Spacing.small,
      paddingBottom: insets.bottom + Spacing.small,
      backgroundColor: Colors.background.primaryLight,
    },
    bottomButtonText: {
      ...Typography.header.x20,
      color: Colors.primary.shade100,
      paddingHorizontal: Spacing.large,
      textAlign: "center",
    },
  })
}

const MemoizedHowItWorksScreen = React.memo(HowItWorksScreen)

export default MemoizedHowItWorksScreen
