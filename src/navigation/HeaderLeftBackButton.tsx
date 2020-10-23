import React, { ReactNode } from "react"

import { HeaderBackButton } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"

import { Colors } from "../styles"

export const applyHeaderLeftBackButton = () => {
  return function modalHeader(): ReactNode {
    return <HeaderLeftBackButton />
  }
}

const HeaderLeftBackButton = () => {
  const navigation = useNavigation()

  return (
    <HeaderBackButton
      tintColor={Colors.primary.shade150}
      onPress={() => navigation.goBack()}
    />
  )
}
