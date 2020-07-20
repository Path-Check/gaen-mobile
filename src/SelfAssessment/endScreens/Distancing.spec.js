import { fireEvent, render } from "@testing-library/react-native"
import React from "react"
import { I18nextProvider } from "react-i18next"

import i18n from "../../locales/languages"
import { AssessmentNavigationContext } from "../Context"

import { Distancing } from "./Distancing"

describe("Distancing", () => {
  it("displays the distancing screen title and description", () => {
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider
          value={{ completeRoute: "MyRoute" }}
        >
          <Distancing />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    expect(getByText("Distancing & PPE")).toBeDefined()
    expect(
      getByText(
        "Please follow your local, state, or national guidelines for social distancing and Personal Protection Equipment (PPE) like masks and/or gloves. No additional action is needed at this time.",
      ),
    ).toBeDefined()
  })

  it("navigates to the next screen whentap on the CTA button", () => {
    const push = jest.fn()
    const { getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider
          value={{ completeRoute: "MyRoute" }}
        >
          <Distancing navigation={{ push }} />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    const cta = getByTestId("assessment-button")
    fireEvent.press(cta)
    expect(push).toHaveBeenCalledWith("MyRoute")
  })
})
