import useAuthorityCopy from "./useAuthorityCopy"

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

describe("useAuthorityCopy", () => {
  it("uses the default value if no locale is available", () => {
    const defaultValue = "default"
    expect(useAuthorityCopy("about", "es_PR", defaultValue)).toEqual(
      defaultValue,
    )
  })

  it("uses the default locale value if the locale is not available", () => {
    expect(useAuthorityCopy("legal", "es_PR", "default")).toEqual(
      "legalOverride",
    )
  })

  it("uses the locale value if the locale is available", () => {
    expect(useAuthorityCopy("about", "el", "default")).toEqual("aboutOverride")
  })
})
