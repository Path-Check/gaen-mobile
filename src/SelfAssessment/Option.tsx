import React, { FunctionComponent } from "react"
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { SvgXml } from "react-native-svg"

import Icon from "../assets/svgs/check"
import { GlobalText } from "../components/GlobalText"
import {
  SCREEN_TYPE_CHECKBOX,
  SCREEN_TYPE_DATE,
  SCREEN_TYPE_RADIO,
} from "./constants"

import { Colors, Forms, Spacing, Typography } from "../styles"

interface OptionProps {
  isValidType: boolean
  isSelected: boolean
  inputType: string
  title: string
  onPress: () => void
  testID?: string
}

const Option: FunctionComponent<OptionProps> = ({
  isValidType,
  isSelected,
  inputType,
  title,
  onPress,
  testID,
}) => {
  return (
    <TouchableOpacity onPress={onPress} testID={testID || "option"}>
      <View style={[style.container, isSelected && style.containerSelected]}>
        <OptionSelect
          wrapperStyle={style.primary}
          isValidType={isValidType}
          isSelected={isSelected}
          title={title}
          inputType={inputType}
          icon={Icon}
        />
      </View>
    </TouchableOpacity>
  )
}

interface OptionSelectProps
  extends Pick<
    OptionProps,
    "isValidType" | "isSelected" | "inputType" | "title"
  > {
  wrapperStyle: ViewStyle
  icon: string
}

const OptionSelect: FunctionComponent<OptionSelectProps> = ({
  wrapperStyle,
  isValidType,
  isSelected,
  inputType,
  icon,
  title,
}) => {
  const indicatorStyle =
    inputType === SCREEN_TYPE_CHECKBOX
      ? style.indicatorCheck
      : style.indicatorRadio

  return (
    <View style={wrapperStyle}>
      {isValidType && (
        <View style={[indicatorStyle, isSelected && style.indicatorSelected]}>
          {isSelected && inputType === SCREEN_TYPE_CHECKBOX && (
            <SvgXml width={Spacing.medium} xml={icon} />
          )}
          {isSelected &&
            (inputType === SCREEN_TYPE_RADIO || inputType === SCREEN_TYPE_DATE)}
        </View>
      )}
      <GlobalText style={style.title} testID="label">
        {title}
      </GlobalText>
    </View>
  )
}

const style = StyleSheet.create({
  indicatorRadio: {
    ...Forms.inputIndicator,
    borderRadius: Spacing.medium * 2,
  },
  indicatorCheck: {
    ...Forms.inputIndicator,
    borderWidth: 2,
    borderRadius: Spacing.tiny,
  },
  indicatorSelected: {
    backgroundColor: Colors.primary100,
    borderColor: Colors.primary100,
  },
  title: {
    ...Typography.largeFont,
    ...Typography.bold,
    color: Colors.primaryText,
    lineHeight: Typography.mediumLineHeight,
    flex: 1,
    flexWrap: "wrap",
  },
  container: {
    backgroundColor: Colors.primaryLightBackground,
    borderColor: Colors.neutral30,
    borderRadius: Spacing.xxSmall,
    borderWidth: 2,
    marginBottom: Spacing.small,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
  },
  containerSelected: {
    backgroundColor: Colors.secondary75,
    borderColor: Colors.primary100,
  },
  primary: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
})

export default Option
