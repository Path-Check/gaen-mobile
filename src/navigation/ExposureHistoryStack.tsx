import React, { FunctionComponent } from "react"
import { useNavigation } from "@react-navigation/native"
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import ExposureHistoryScreen from "../ExposureHistory/index"
import MoreInfo from "../ExposureHistory/MoreInfo"
import ExposureDetail from "../ExposureHistory/ExposureDetail"
import {
  ExposureHistoryStackScreens,
  ExposureHistoryStackScreen,
} from "./index"

import { Headers, Colors } from "../styles"

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
          ...Headers.headerLightOptions,
          title: t("navigation.exposure"),
          headerLeft: function headerLeft() {
            return <BackButton />
          },
        }}
      />
    </Stack.Navigator>
  )
}

const BackButton: FunctionComponent = () => {
  const navigation = useNavigation()
  return (
    <HeaderBackButton
      labelVisible={false}
      tintColor={Colors.primary125}
      onPress={navigation.goBack}
    />
  )
}

export default ExposureHistoryStack
