import React from "react"

import { render, fireEvent } from "@testing-library/react-native"
import { I18nextProvider } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import i18n from "../locales/languages"
import AssessmentStart from "./AssessmentStart"

jest.mock("@react-navigation/native")

describe("AssessmentStart", () => {
  it("displays the info for the assesment start", () => {
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentStart />
      </I18nextProvider>,
    )

    expect(
      getByText(
        "Answer questions about your symptoms and medical history to learn what to do next about COVID-19",
      ),
    ).toBeDefined()
    expect(
      getByText(
        "Your information is private, anonymized, and encrypted. No data leaves your device unless you give permission.",
      ),
    ).toBeDefined()
  })

  it("navigates to the agreement screen when tapped on the cta", () => {
    const navigationSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

    const { getByLabelText } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentStart />
      </I18nextProvider>,
    )

    fireEvent.press(getByLabelText("Start"))

    expect(navigationSpy).toHaveBeenCalledWith("Agreement")
  })
})
