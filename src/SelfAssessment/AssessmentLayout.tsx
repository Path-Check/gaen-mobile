import React, { FunctionComponent, ReactNode } from "react"
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  ImageSourcePropType,
} from "react-native"
import { SvgXml } from "react-native-svg"

const NO_IMAGE_BACKGROUND = 0

type AssessmentLayoutProps = {
  backgroundColor: string
  backgroundImage?: ImageSourcePropType
  scrollStyle?: ViewStyle
  footer: ReactNode
  icon: string
}

const AssessmentLayout: FunctionComponent<AssessmentLayoutProps> = ({
  backgroundColor,
  backgroundImage = NO_IMAGE_BACKGROUND,
  children,
  scrollStyle,
  footer,
  icon,
}) => {
  return (
    <SafeAreaView
      style={{
        ...assessmentStyles.container,
        backgroundColor: backgroundColor,
      }}
    >
      <ImageBackground
        source={backgroundImage}
        style={assessmentStyles.backgroundImage}
      >
        <ScrollView style={assessmentStyles.scrollView}>
          <View style={[assessmentStyles.scrollViewContent, scrollStyle]}>
            {icon && <SvgXml xml={icon} />}
            {children}
          </View>
        </ScrollView>
        <View style={assessmentStyles.footer}>{footer}</View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export const assessmentStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    borderTopWidth: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    borderTopWidth: 0,
  },
  footer: {
    padding: 20,
  },
})

export { AssessmentLayout }
