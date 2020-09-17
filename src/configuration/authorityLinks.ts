import links from "./links.json"

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
        const localizedLabel = label[localeCode] || ""
        return localizedLabel.length > 0
      })
      .map(({ url, label }) => {
        return { url, label: label[localeCode] }
      })
  } catch {
    return []
  }
}

export { applyTranslations, loadAuthorityLinks }
