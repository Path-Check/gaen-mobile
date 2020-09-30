import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import ExposureHistoryScreen from "../ExposureHistory/index"
import MoreInfo from "../ExposureHistory/MoreInfo"
import ExposureDetail from "../ExposureHistory/ExposureDetail"
import {
  ExposureHistoryStackScreens,
  ExposureHistoryStackScreen,
} from "./index"

import { Headers } from "../styles"

type ExposureHistoryStackParams = {
  [key in ExposureHistoryStackScreen]: undefined
}
const Stack = createStackNavigator<ExposureHistoryStackParams>()

const ExposureHistoryStack: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ExposureHistoryStackScreens.ExposureHistory}
        component={ExposureHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ExposureHistoryStackScreens.MoreInfo}
        component={MoreInfo}
        options={{
          ...Headers.headerScreenOptions,
          title: t("navigation.more_info"),
        }}
      />
      <Stack.Screen
        name={ExposureHistoryStackScreens.ExposureDetail}
        component={ExposureDetail}
        options={{
          ...Headers.headerScreenOptions,
          title: t("navigation.exposure"),
        }}
      />
    </Stack.Navigator>
  )
}

export default ExposureHistoryStack
