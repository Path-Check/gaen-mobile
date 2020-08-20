import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react-native"
import NoExposures from "./NoExposures"
import { Linking } from "react-native"
import { ConfigurationContext } from "../../ConfigurationContext"
import { factories } from "../../factories"

afterEach(cleanup)
describe("NoExposures", () => {
  it("reports when a user has no exposures", () => {
    expect.assertions(2)
    const { queryByText } = render(<NoExposures />)
    expect(queryByText("No Exposure Reports")).not.toBeNull()
    expect(
      queryByText(
        "You haven't received any exposure reports over the past 14-days",
      ),
    ).not.toBeNull()
  })

  it("displays generic health guidance", () => {
    expect.assertions(1)
    const { queryByText } = render(<NoExposures />)
    expect(queryByText("Wash your hands often")).not.toBeNull()
  })

  describe("when the HA has provided a link", () => {
    it("prompts the user to see HA guidance", () => {
      expect.assertions(2)
      const healthAuthorityAdviceUrl = "https://www.health.state.mn.us/"
      const healthAuthorityName = "healthAuthorityName"
      const openURLSpy = jest.spyOn(Linking, "openURL")

      const { queryByText, getByText } = render(
        <ConfigurationContext.Provider
          value={factories.configurationContext.build({
            healthAuthorityAdviceUrl,
            healthAuthorityName,
          })}
        >
          <NoExposures />
        </ConfigurationContext.Provider>,
      )

      expect(
        queryByText(`Review guidance from ${healthAuthorityName}`),
      ).not.toBeNull()
      fireEvent.press(getByText("Learn More"))
      expect(openURLSpy).toHaveBeenCalledWith(healthAuthorityAdviceUrl)
    })
  })
})
