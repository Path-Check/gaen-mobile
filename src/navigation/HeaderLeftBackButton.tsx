import React, { FunctionComponent, ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { HeaderBackButton } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"

import { Colors } from "../styles"

export const applyHeaderLeftBackButton = (onPress?: () => void) => {
  return function modalHeader(): ReactNode {
    return <HeaderLeftBackButton onPress={onPress} />
  }
}

interface HeaderLeftBackButtonProps {
  onPress?: () => void
}

const HeaderLeftBackButton: FunctionComponent<HeaderLeftBackButtonProps> = ({
  onPress,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPress = () => {
    onPress ? onPress() : navigation.goBack()
  }

  return (
    <HeaderBackButton
      label={t("common.back")}
      tintColor={Colors.primary.shade150}
      onPress={handleOnPress}
    />
  )
}
