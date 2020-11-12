import AsyncStorage from "@react-native-community/async-storage"

type StorageKey = "LANG_OVERRIDE" | "ONBOARDING_COMPLETE" | "ANALYTICS_CONSENT"

const LANG_OVERRIDE: StorageKey = "LANG_OVERRIDE"
const ONBOARDING_COMPLETE: StorageKey = "ONBOARDING_COMPLETE"
const ANALYTICS_CONSENT: StorageKey = "ANALYTICS_CONSENT"

async function getStoreData(key: StorageKey): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key)
  } catch (error) {
    console.log(error.message)
    return null
  }
}

async function setStoreData(key: StorageKey, item: string): Promise<void> {
  try {
    return await AsyncStorage.setItem(key, item)
  } catch (error) {
    console.log(error.message)
  }
}

async function removeStoreData(key: StorageKey): Promise<void> {
  try {
    return await AsyncStorage.removeItem(key)
  } catch (error) {
    console.log(error.message)
  }
}

export const removeAll = async (): Promise<void> => {
  removeUserLocaleOverride()
  removeIsOnboardingComplete()
  removeAnalyticsConsent()
}

// Language Override
export async function getUserLocaleOverride(): Promise<string | null> {
  return await getStoreData(LANG_OVERRIDE)
}

export async function setUserLocaleOverride(locale: string): Promise<void> {
  return await setStoreData(LANG_OVERRIDE, locale)
}

export async function removeUserLocaleOverride(): Promise<void> {
  return await removeStoreData("LANG_OVERRIDE")
}

// Onboarding completion
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

// Consented to Product Analytics
const USER_CONSENTED = "USER_CONSENTED"
const USER_NOT_CONSENTED = "USER_NOT_CONSENTED"

export async function getAnalyticsConsent(): Promise<boolean> {
  const userConsented = await getStoreData(ANALYTICS_CONSENT)
  return consentToBoolean(userConsented)
}

export async function setAnalyticsConsent(consent: boolean): Promise<void> {
  return setStoreData(ANALYTICS_CONSENT, booleanToConsent(consent))
}

export async function removeAnalyticsConsent(): Promise<void> {
  return removeStoreData(ANALYTICS_CONSENT)
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
