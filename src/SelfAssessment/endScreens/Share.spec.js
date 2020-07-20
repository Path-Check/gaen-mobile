import { fireEvent, render } from "@testing-library/react-native"
import React from "react"
import { I18nextProvider } from "react-i18next"
import env from "react-native-config"

import i18n from "../../locales/languages"
import { AssessmentNavigationContext } from "../Context"
import { Share } from "./Share"

describe("Share", () => {
  it("displays the share screen title and description", () => {
    const mockedAuthorityName = env.GAEN_AUTHORITY_NAME
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider
          value={{ completeRoute: "MyRoute" }}
        >
          <Share />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    expect(getByText("Publish anonymized data")).toBeDefined()
    expect(
      getByText(
        `Your anonymous data helps the ${mockedAuthorityName} analyze, track, and contain the spread of COVID-19. Your data will be aggregated that from other PathCheck users who choose to share.`,
        { exact: false },
      ),
    ).toBeDefined()
    expect(
      getByText(
        `Your data contains your survey responses and zip code, but no additional or personally-identifying information.`,
        { exact: false },
      ),
    ).toBeDefined()
    expect(
      getByText(
        `The ${mockedAuthorityName} will retain your anonymous data for a specific period of time.`,
        { exact: false },
      ),
    ).toBeDefined()
  })

  it("navigates to the assessment complete screen when tap on the cta", () => {
    const push = jest.fn()
    const { getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <AssessmentNavigationContext.Provider
          value={{ completeRoute: "MyRoute" }}
        >
          <Share navigation={{ push }} />
        </AssessmentNavigationContext.Provider>
      </I18nextProvider>,
    )
    const cta = getByTestId("assessment-button")
    fireEvent.press(cta)
    expect(push).toHaveBeenCalledWith("AssessmentComplete")
  })
})
