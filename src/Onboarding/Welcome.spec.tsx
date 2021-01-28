import React from "react"
import { render } from "@testing-library/react-native"

import Welcome from "./Welcome"
import { useLocaleInfo, enabledLocales } from "../locales/languages"

jest.mock("../locales/languages.ts")
jest.mock("@react-navigation/native")
;(useLocaleInfo as jest.Mock).mockReturnValue({
  localeCode: "en",
  languageName: "English",
})

describe("Welcome", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("when the app supports more than 1 locale", () => {
    it("displays a set language button", () => {
      ;(enabledLocales as jest.Mock).mockReturnValueOnce([
        {
          value: "en",
          label: "English",
        },
        {
          value: "es",
          label: "Spanish",
        },
      ])
      ;(useLocaleInfo as jest.Mock).mockReturnValue({
        localeCode: "en",
        languageName: "English",
      })

      const { getByTestId } = render(<Welcome />)

      expect(getByTestId("welcome-language-button")).toBeDefined()
    })
  })

  describe("when the app supports only 1 locale", () => {
    it("does not display a set language button", () => {
      ;(enabledLocales as jest.Mock).mockReturnValueOnce([
        {
          value: "en",
          label: "English",
        },
      ])
      ;(useLocaleInfo as jest.Mock).mockReturnValue({
        localeCode: "en",
        languageName: "English",
      })

      const { queryByTestId } = render(<Welcome />)

      expect(queryByTestId("welcome-language-button")).toBeNull()
    })
  })
})
