import { fireEvent, render } from "@testing-library/react-native"
import React from "react"
import { I18nextProvider } from "react-i18next"

import i18n from "../../locales/languages"
import { AssessmentNavigationContext } from "../Context"
import { AssessmentComplete } from "./AssessmentComplete"

describe("AssessmentComplete", () => {
  it("renders the right title and description", () => {
    const meta = {
      completeRoute: "MyRoute",
    }
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider value={meta}>
          <AssessmentComplete />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    expect(getByText("Thanks for keeping your community safe!")).toBeDefined()
    expect(
      getByText(
        "By sharing your health status and exposure history anonymously with your community, you are being proactive about fighting the spread of COVID-19.",
      ),
    ).toBeDefined()
  })

  it("calls the dismiss action when the cta is clicked", () => {
    const meta = {
      completeRoute: "MyRoute",
    }
    const dismiss = jest.fn()
    meta.dismiss = dismiss
    const { getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider value={meta}>
          <AssessmentComplete />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    const cta = getByTestId("assessment-button")
    fireEvent.press(cta)
    expect(dismiss).toHaveBeenCalled()
  })
})
