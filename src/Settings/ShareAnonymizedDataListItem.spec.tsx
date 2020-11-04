import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { ProductAnalyticsContext } from "../ProductAnalytics/Context"
import ShareAnonymizedDataListItem from "./ShareAnonymizedDataListItem"
import { factories } from "../factories"
import { ModalStackScreens } from "../navigation"

jest.mock("@react-navigation/native")
describe("ShareAnonymizedDataListItem", () => {
  describe("when a user has consented to analytics", () => {
    it("displays a check icon", () => {
      const context = factories.productAnalyticsContext.build({
        userConsentedToAnalytics: true,
      })

      const { getByTestId } = render(
        <ProductAnalyticsContext.Provider value={context}>
          <ShareAnonymizedDataListItem />
        </ProductAnalyticsContext.Provider>,
      )

      const activeStateIcon = getByTestId("sharing-data")
      expect(activeStateIcon).not.toBeNull()
    })
  })

  describe("when a user has not consented to analytics", () => {
    it("displays an x icon", () => {
      const context = factories.productAnalyticsContext.build({
        userConsentedToAnalytics: false,
      })

      const { getByTestId } = render(
        <ProductAnalyticsContext.Provider value={context}>
          <ShareAnonymizedDataListItem />
        </ProductAnalyticsContext.Provider>,
      )

      const inactiveStateIcon = getByTestId("not-sharing-data")
      expect(inactiveStateIcon).not.toBeNull()
    })
  })

  it("opens the share anonymized data modal", () => {
    const navigationSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

    const context = factories.productAnalyticsContext.build({
      userConsentedToAnalytics: false,
    })

    const { getByText } = render(
      <ProductAnalyticsContext.Provider value={context}>
        <ShareAnonymizedDataListItem />
      </ProductAnalyticsContext.Provider>,
    )

    const shareDataListItem = getByText("Share Anonymized Data")
    fireEvent.press(shareDataListItem)
    expect(navigationSpy).toHaveBeenCalledWith(
      ModalStackScreens.AnonymizedDataConsent,
    )
  })
})
