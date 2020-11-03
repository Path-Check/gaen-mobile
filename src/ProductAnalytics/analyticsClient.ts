import Matomo from "react-native-matomo-sdk"

import { EventCategory, EventAction } from "./Context"

export const trackEvent = async (
  category: EventCategory,
  action: EventAction,
  name: string,
): Promise<void> => {
  Matomo.trackEvent(category, action, name)
}

export const trackScreenView = async (screen: string): Promise<void> => {
  Matomo.trackView([screen])
}
