import { loadAuthorityLinks, applyTranslations } from "./authorityLinks"

jest.mock("../../config/links.json", () => {
  return {
    legal: [
      {
        url: "thirdUrl",
        label: {
          en: "thirdUrl",
          el: "",
        },
      },
    ],
  }
})

describe("loadAuthorityLinks", () => {
  it("loads the copy for the provided key if it is present", () => {
    expect(loadAuthorityLinks("legal")).toEqual([
      {
        url: "thirdUrl",
        label: {
          en: "thirdUrl",
          el: "",
        },
      },
    ])
  })

  it("returns an empty array if the override is not present", () => {
    expect(loadAuthorityLinks("about")).toEqual([])
  })
})

describe("applyTranslations", () => {
  it("filters the links with no translation for the passed locale", () => {
    const links = [
      {
        url: "firstUrl",
        label: {
          en: "",
          el: "",
        },
      },
      {
        url: "secondUrl",
        label: {
          en: "",
          el: "secondUrl",
        },
      },
    ]

    expect(applyTranslations(links, "el")).toEqual([
      {
        url: "secondUrl",
        label: "secondUrl",
      },
    ])
  })

  it("returns an empty array if no translations are present", () => {
    const links = [
      {
        url: "thirdUrl",
        label: {
          en: "thirdUrl",
          el: "",
        },
      },
    ]

    expect(applyTranslations(links, "el")).toEqual([])
  })
})
