import copy from "./copy.json"

const DEFAULT_LOCALE = "en"
type CopyKey = "welcome_message" | "about" | "legal"
type CopyValues = Record<string, string>
type AuthorityCopyContent = Record<CopyKey, CopyValues>

const useAuthorityCopy = (
  key: CopyKey,
  localeCode: string,
  defaultValue: string,
): string => {
  try {
    const authorityCopyOverrides = (copy as AuthorityCopyContent)[key]
    const overrideCopy =
      authorityCopyOverrides[localeCode] ||
      authorityCopyOverrides[DEFAULT_LOCALE]

    return overrideCopy.length > 0 ? overrideCopy : defaultValue
  } catch {
    return defaultValue
  }
}

export default useAuthorityCopy
