import links from "./links.json"

const DEFAULT_LOCALE = "en"
type TranslationValue = Record<string, string>
type LinkData = {
  url: string
  label: TranslationValue
}
type LinkKeys = "about" | "legal"
type AuthorityLinksContent = Record<LinkKeys, LinkData[]>
type DisplayableLink = {
  url: string
  label: string
}

const useAuthorityLinks = (
  key: LinkKeys,
  localeCode: string,
): DisplayableLink[] => {
  try {
    const authorityLinks = links as AuthorityLinksContent
    const linksForKey = authorityLinks[key] || []

    const linksOverride = linksForKey
      .filter(({ label }) => {
        const localizedLabel = label[localeCode] || label[DEFAULT_LOCALE]
        return localizedLabel.length > 0
      })
      .map(({ url, label }) => {
        const localizedLabel = label[localeCode] || label[DEFAULT_LOCALE]
        return { url, label: localizedLabel }
      })
    return linksOverride
  } catch {
    return []
  }
}

export default useAuthorityLinks
