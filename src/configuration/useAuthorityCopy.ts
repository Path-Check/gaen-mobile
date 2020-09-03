import copy from "./copy.json"

type CopyKey = "welcome_message" | "about" | "legal"
type CopyValues = Record<string, string>
type AuthorityCopyContent = Record<CopyKey, CopyValues>

const useAuthorityCopy = (
  key: CopyKey,
  localeCode: string,
  defaultValue: string,
): string => {
  try {
    const authorityCopyOverrides = copy as AuthorityCopyContent
    const overrideCopy = authorityCopyOverrides[key][localeCode]

    return overrideCopy.length > 0 ? overrideCopy : defaultValue
  } catch {
    return defaultValue
  }
}

export default useAuthorityCopy
