import { loadAuthorityCopy, authorityCopyTranslation } from "./authorityCopy"

jest.mock("./copy.json", () => {
  return {
    about: {
      en: "",
      el: "aboutOverride",
    },
    legal: {
      en: "legalOverride",
      el: "",
    },
  }
})

describe("loadAuthorityCopy", () => {
  it("loads the copy for the provided key if it is present", () => {
    expect(loadAuthorityCopy("about")).toEqual({ en: "", el: "aboutOverride" })
  })

  it("returns an empty object if the override is not present", () => {
    expect(loadAuthorityCopy("welcome_message")).toEqual({})
  })
})

describe("authorityCopyTranslation", () => {
  it("uses the default value if no locale is available", () => {
    const defaultValue = "default"
    const aboutOverride = {
      en: "",
      el: "aboutOverride",
    }
    expect(
      authorityCopyTranslation(aboutOverride, "es_PR", defaultValue),
    ).toEqual(defaultValue)
  })

  it("uses the default locale value if the locale is not available", () => {
    const legalOverride = {
      en: "legalOverride",
    }
    expect(authorityCopyTranslation(legalOverride, "es_PR", "default")).toEqual(
      legalOverride.en,
    )
  })

  it("uses the locale value if the locale is available", () => {
    const aboutOverride = {
      en: "",
      el: "aboutOverride",
    }
    expect(authorityCopyTranslation(aboutOverride, "el", "default")).toEqual(
      aboutOverride.el,
    )
  })
})
