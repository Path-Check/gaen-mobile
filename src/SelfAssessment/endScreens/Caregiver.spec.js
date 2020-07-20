import { fireEvent, render } from "@testing-library/react-native"
import React from "react"
import { I18nextProvider } from "react-i18next"

import i18n from "../../locales/languages"
import { AssessmentNavigationContext } from "../Context"

import { Caregiver } from "./Caregiver"

describe("Caregiver", () => {
  it("displays the right title and description", () => {
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider
          value={{ completeRoute: "MyRoute" }}
        >
          <Caregiver />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    expect(getByText("Notify Caregiver")).toBeDefined()
    expect(
      getByText(
        "Notify a healthcare provider in your long-term care facility. Living in a long-term care facility or nursing home may put you at risk for severe illness.",
        { exact: false },
      ),
    ).toBeDefined()
    expect(
      getByText(
        "Tell a caregiver at the facility that you are sick and need to see a medical provider as soon as possible.",
        { exact: false },
      ),
    ).toBeDefined()
  })

  it("navigates to the next screen when clicks on the cta", () => {
    const push = jest.fn()
    const { getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider
          value={{ completeRoute: "MyRoute" }}
        >
          <Caregiver navigation={{ push }} />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    const cta = getByTestId("assessment-button")
    fireEvent.press(cta)
    expect(push).toHaveBeenCalledWith("MyRoute")
  })
})
