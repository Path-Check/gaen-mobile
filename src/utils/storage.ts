import AsyncStorage from "@react-native-community/async-storage"

export async function getStoreData(
  key: string,
  isString = true,
): Promise<Record<string, string> | string | null> {
  try {
    const data = await AsyncStorage.getItem(key)

    if (isString) {
      return data
    }

    if (data) {
      return JSON.parse(data)
    }
    return null
  } catch (error) {
    console.log(error.message)
    return null
  }
}

export async function setStoreData(
  key: string,
  item: Record<string, string> | string,
): Promise<void> {
  try {
    if (typeof item !== "string") {
      item = JSON.stringify(item)
    }

    return await AsyncStorage.setItem(key, item)
  } catch (error) {
    console.log(error.message)
  }
}
