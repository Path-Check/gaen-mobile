import React, { FunctionComponent } from 'react';
import {
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';

import SettingsScreen from '../views/Settings';
import AboutScreen from '../views/About';
import LicensesScreen from '../views/Licenses';
import AffectedUserStack from '../bt/AffectedUserFlow';
import ENDebugMenu from '../views/Settings/ENDebugMenu';
import ENLocalDiagnosisKeyScreen from '../views/Settings/ENLocalDiagnosisKeyScreen';
import ExposureListDebugScreen from '../views/Settings/ExposureListDebugScreen';
import LanguageSelection from '../views/LanguageSelection';

import { Screens, Stacks } from './index';

const Stack = createStackNavigator();

const SCREEN_OPTIONS = {
  headerShown: false,
};

type MoreStackRouteName =
  | 'Settings'
  | 'About'
  | 'Licenses'
  | 'ENDebugMenu'
  | 'LanguageSelection'
  | 'AffectedUserFlow'
  | 'ExposureListDebugScreen'
  | 'ENLocalDiagnosisKey';

interface MoreStackRouteState {
  index: number;
  key: string;
  routeNames: MoreStackRouteName[];
  routes: MoreStackRoute[];
  stale: boolean;
  type: 'stack';
}

export interface MoreStackRoute {
  key: string;
  name: 'More';
  params: undefined;
  state?: MoreStackRouteState;
}

export const determineTabBarVisibility = (route: MoreStackRoute): boolean => {
  if (route.state) {
    const routeState = route.state;
    const currentRoute = routeState.routes[routeState.index];
    const routeName = currentRoute.name;
    return routeName != Stacks.AffectedUserFlow;
  } else {
    return true;
  }
};

const MoreStack: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name={Screens.Settings} component={SettingsScreen} />
      <Stack.Screen name={Screens.About} component={AboutScreen} />
      <Stack.Screen name={Screens.Licenses} component={LicensesScreen} />
      <Stack.Screen name={Screens.ENDebugMenu} component={ENDebugMenu} />
      <Stack.Screen
        name={Screens.LanguageSelection}
        component={LanguageSelection}
      />
      <Stack.Screen
        name={Stacks.AffectedUserFlow}
        component={AffectedUserStack}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={Screens.ExposureListDebugScreen}
        component={ExposureListDebugScreen}
      />
      <Stack.Screen
        name={Screens.ENLocalDiagnosisKey}
        component={ENLocalDiagnosisKeyScreen}
      />
    </Stack.Navigator>
  );
};

export default MoreStack;
