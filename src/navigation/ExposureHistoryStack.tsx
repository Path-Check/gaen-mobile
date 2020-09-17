import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import ExposureHistoryScreen from "../ExposureHistory/index"
import MoreInfo from "../ExposureHistory/MoreInfo"
import ExposureDetail from "../ExposureHistory/ExposureDetail"
import {
  ExposureHistoryScreens,
  ExposureHistoryScreen as Screen,
} from "./index"

import { Headers } from "../styles"

type ExposureHistoryStackParams = {
  [key in Screen]: undefined
}
const Stack = createStackNavigator<ExposureHistoryStackParams>()

const ExposureHistoryStack: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ExposureHistoryScreens.ExposureHistory}
        component={ExposureHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ExposureHistoryScreens.MoreInfo}
        component={MoreInfo}
        options={{
          ...Headers.headerScreenOptions,
          title: t("navigation.more_info"),
        }}
      />
      <Stack.Screen
        name={ExposureHistoryScreens.ExposureDetail}
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
