import React from "react"
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  StyleSheet,
} from "react-native"

import { isPlatformiOS } from "../../utils/index"

export const KeyboardAvoidingView = ({ behavior, children }) => {
  return (
    <RNKeyboardAvoidingView
      accessible={false}
      style={style.keyboardView}
      autoScrollToFocusedInput
      behavior={isPlatformiOS() ? behavior : null}
    >
      {children}
    </RNKeyboardAvoidingView>
  )
}

const style = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
})
