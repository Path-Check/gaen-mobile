import React, { useState, useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import env from 'react-native-config';
import 'array-flat-polyfill';

import { Entry } from './app/Entry';
import { TracingStrategyProvider } from './app/TracingStrategyContext';
import { store } from './app/store';
import btStrategy from './app/bt';
import gpsStrategy from './app/gps';
import {
  OnboardingProvider,
  isOnboardingComplete,
} from './app/OnboardingContext';

const determineTracingStrategy = () => {
  switch (env.TRACING_STRATEGY) {
    case 'gps': {
      return gpsStrategy;
    }
    case 'bt': {
      return btStrategy;
    }
    default: {
      throw new Error('Unsupported Tracing Strategy');
    }
  }
};

const strategy = determineTracingStrategy();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingIsComplete, setOnboardingIsComplete] = useState(false);

  useEffect(() => {
    isOnboardingComplete()
      .then((isComplete) => {
        setOnboardingIsComplete(isComplete);
      })
      .finally(() => {
        setIsLoading(false);
        SplashScreen.hide();
      });
  }, []);

  return (
    <Provider store={store}>
      {!isLoading ? (
        <OnboardingProvider onboardingIsComplete={onboardingIsComplete}>
          <MenuProvider>
            <TracingStrategyProvider strategy={strategy}>
              <Entry />
            </TracingStrategyProvider>
          </MenuProvider>
        </OnboardingProvider>
      ) : null}
    </Provider>
  );
};

export default App;
