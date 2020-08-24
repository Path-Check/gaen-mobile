import AsyncStorage from "@react-native-community/async-storage"

async function getStoreData(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key)
  } catch (error) {
    console.log(error.message)
    return null
  }
}

async function setStoreData(key: string, item: string): Promise<void> {
  try {
    return await AsyncStorage.setItem(key, item)
  } catch (error) {
    console.log(error.message)
  }
}

async function removeStoreData(key: string): Promise<void> {
  try {
    return await AsyncStorage.removeItem(key)
  } catch (error) {
    console.log(error.message)
  }
}

const LANG_OVERRIDE = "LANG_OVERRIDE"
export async function getUserLocaleOverride(): Promise<string | null> {
  return await getStoreData(LANG_OVERRIDE)
}

export async function setUserLocaleOverride(locale: string): Promise<void> {
  return await setStoreData(LANG_OVERRIDE, locale)
}

const ONBOARDING_COMPLETE = "ONBOARDING_COMPLETE"
export async function getIsOnboardingComplete(): Promise<boolean> {
  const onboardingComplete = await getStoreData(ONBOARDING_COMPLETE)
  return onboardingComplete === ONBOARDING_COMPLETE
}

export async function setIsOnboardingComplete(): Promise<void> {
  return setStoreData(ONBOARDING_COMPLETE, ONBOARDING_COMPLETE)
}

export async function removeIsOnboardingComplete(): Promise<void> {
  return removeStoreData(ONBOARDING_COMPLETE)
}

const ANALYTICS_CONSENT = "ANALYTICS_CONSENT"
const USER_CONSENTED = "USER_CONSENTED"
const USER_NOT_CONSENTED = "USER_NOT_CONSENTED"

export async function getAnalyticsConsent(): Promise<boolean> {
  const userConsented = await getStoreData(ANALYTICS_CONSENT)
  return consentToBoolean(userConsented)
}

export async function setAnalyticsConsent(consent: boolean): Promise<void> {
  return setStoreData(ANALYTICS_CONSENT, booleanToConsent(consent))
}

const consentToBoolean = (consent: string | null): boolean => {
  switch (consent) {
    case "USER_CONSENTED":
      return true
    case null:
      return false
    default:
      return false
  }
}

const booleanToConsent = (bool: boolean): string => {
  switch (bool) {
    case true:
      return USER_CONSENTED
    case false:
      return USER_NOT_CONSENTED
  }
}
