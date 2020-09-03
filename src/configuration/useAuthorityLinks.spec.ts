import useAuthorityLinks from "./useAuthorityLinks"

jest.mock("./links.json", () => {
  return {
    about: [
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
    ],
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

describe("useAuthorityLinks", () => {
  it("filters the links with no translation", () => {
    expect(useAuthorityLinks("about", "el")).toEqual([
      {
        url: "secondUrl",
        label: "secondUrl",
      },
    ])
  })

  it("defaults to the en default translation", () => {
    expect(useAuthorityLinks("legal", "el")).toEqual([
      {
        url: "thirdUrl",
        label: "thirdUrl",
      },
    ])
  })
})
