import { Factory } from "fishery"

import {
  TracingStrategy,
  StrategyCopyContent,
  StrategyAssets,
} from "../tracingStrategy"

import { Images } from "../../app/assets/images"

export default Factory.define<TracingStrategy>(() => ({
  name: "test-tracing-strategy",
  exposureEventsStrategy: {
    exposureInfoSubscription: () => {
      return { remove: () => {} }
    },
    toExposureHistory: () => [],
    getCurrentExposures: () => {},
  },
  assets: testStrategyAssets,
  useCopy: () => testStrategyCopy,
}))

export const testStrategyCopy: StrategyCopyContent = {
  aboutHeader: "aboutHeader",
  detailedHistoryWhatThisMeansPara: "detailedHistoryWhatThisMeansPara",
  exportCompleteBody: "exportCompleteBody",
  exportPublishButtonSubtitle: "exportPublishButtonSubtitle",
  exposureNotificationsNotAvailableHeader:
    "exposureNotificationsNotAvailableHeader",
  exposureNotificationsNotAvailableSubheader:
    "exposureNotificationsNotAvailableSubheader",
  moreInfoHowContent: "moreInfoHowContent",
  moreInfoWhyContent: "moreInfoWhyContent",
  personalPrivacyHeader: "onboarding2Header",
  personalPrivacySubheader: "onboarding2Subheader",
  notificationDetailsHeader: "onboarding3Header",
  notificationDetailsSubheader: "onboarding3Subheader",
  settingsLoggingActive: "settingsLoggingActive)",
  settingsLoggingInactive: "settingsLoggingInactive",
}

export const testStrategyAssets: StrategyAssets = {
  personalPrivacyBackground: Images.BlueGradientBackground,
  personalPrivacyIcon: "",
  notificationDetailsBackground: Images.BlueGradientBackground,
  notificationDetailsIcon: "",
}
