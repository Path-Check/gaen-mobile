import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { ModalScreen, ModalScreens } from "./index"
import LanguageSelection from "../Modal/LanguageSelection"

type ModalStackParams = {
  [key in ModalScreen]: undefined
}
const Stack = createStackNavigator<ModalStackParams>()

const ModalStack: FunctionComponent = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name={ModalScreens.LanguageSelection}
        component={LanguageSelection}
      />
    </Stack.Navigator>
  )
}

export default ModalStack
