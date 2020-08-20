import { fireEvent, render } from "@testing-library/react-native"
import React from "react"
import { I18nextProvider } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import i18n from "../../locales/languages"
import { Share } from "./Share"

jest.mock("@react-navigation/native")
describe("Share", () => {
  it("displays the share screen title and description", () => {
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <Share />
      </I18nextProvider>,
    )
    expect(getByText("Publish anonymized data")).toBeDefined()
    expect(getByText(/Your anonymous data helps the/)).toBeDefined()
    expect(
      getByText(
        /Your data contains your survey responses and zip code, but no additional or personally-identifying information./,
      ),
    ).toBeDefined()
    expect(
      getByText(
        /will retain your anonymous data for a specific period of time./,
      ),
    ).toBeDefined()
  })

  it("navigates to the assessment complete screen when tap on the cta", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
    const { getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <Share />
      </I18nextProvider>,
    )
    const cta = getByTestId("assessment-button")
    fireEvent.press(cta)
    expect(navigateSpy).toHaveBeenCalledWith("AssessmentComplete")
  })
})
