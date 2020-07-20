import { fireEvent, render } from "@testing-library/react-native"
import React from "react"
import { I18nextProvider } from "react-i18next"

import i18n from "../../locales/languages"
import { AssessmentNavigationContext } from "../Context"
import { Isolate } from "./Isolate"

describe("Isolate", () => {
  it("displays the isolate screen title and description", () => {
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider
          value={{ completeRoute: "MyRoute" }}
        >
          <Isolate />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    expect(getByText("Isolate Yourself")).toBeDefined()
    expect(
      getByText(
        "You have some symptoms that may be related to COVID-19. Call your healthcare provider if your symptoms get worse. Start home isolation.",
      ),
    ).toBeDefined()
  })

  it("navigates to the next screen route when tapped on the cta", () => {
    const push = jest.fn()
    const { getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider
          value={{ completeRoute: "MyRoute" }}
        >
          <Isolate navigation={{ push }} />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    const cta = getByTestId("assessment-button")
    fireEvent.press(cta)
    expect(push).toHaveBeenCalledWith("MyRoute")
  })
})
