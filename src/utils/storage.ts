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
