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

const loadAuthorityLinks = (key: LinkKeys): LinkData[] => {
  const authorityLinks = links as AuthorityLinksContent
  if (authorityLinks && authorityLinks[key]) {
    return authorityLinks[key]
  }
  return []
}

const applyTranslations = (
  links: LinkData[],
  localeCode: string,
): DisplayableLink[] => {
  try {
    return links
      .filter(({ label }) => {
        const localizedLabel = label[localeCode] || label[DEFAULT_LOCALE]
        return localizedLabel.length > 0
      })
      .map(({ url, label }) => {
        const localizedLabel = label[localeCode] || label[DEFAULT_LOCALE]
        return { url, label: localizedLabel }
      })
  } catch {
    return []
  }
}

export { applyTranslations, loadAuthorityLinks }
