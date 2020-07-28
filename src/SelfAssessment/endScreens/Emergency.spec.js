import { fireEvent, render } from "@testing-library/react-native"
import React from "react"
import { I18nextProvider } from "react-i18next"

import i18n from "../../locales/languages"
import { AssessmentNavigationContext } from "../Context"
import { Emergency } from "./Emergency"

describe("Emergency", () => {
  it("displays the emergency screen title and description", () => {
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider value={{}}>
          <Emergency />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    expect(getByText("Call Emergency Services")).toBeDefined()
    expect(
      getByText(
        "Based on your reported symptoms, you should seek care immediately.",
      ),
    ).toBeDefined()
  })

  it("calls the emergency services when taped on the CTA", () => {
    let openURL = jest.fn()
    jest.doMock("react-native/Libraries/Linking/Linking", () => ({
      openURL: openURL,
    }))
    const { getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider value={{}}>
          <Emergency />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    const cta = getByTestId("assessment-button")
    fireEvent.press(cta)
    expect(openURL).toHaveBeenCalledWith("tel:911")
  })
})
