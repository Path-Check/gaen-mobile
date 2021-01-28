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

  describe("clicking the Learn more link", () => {
    describe("when the health authority has provided a learn more url", () => {
      it("prompts the user to see HA guidance", () => {
        expect.assertions(2)
        const healthAuthorityLearnMoreUrl = "https://www.example.com/"
        const openURLSpy = jest.spyOn(Linking, "openURL")

        const { queryByText, getByText } = render(
          <ConfigurationContext.Provider
            value={factories.configurationContext.build({
              healthAuthorityLearnMoreUrl,
            })}
          >
            <NoExposures />
          </ConfigurationContext.Provider>,
        )

        expect(queryByText(`Review guidance from`)).toBeDefined()
        fireEvent.press(getByText("Review Health Guidance"))
        expect(openURLSpy).toHaveBeenCalledWith(healthAuthorityLearnMoreUrl)
      })
    })

    describe("when the health authority has not provided a link", () => {
      it("does not display a Learn More link", () => {
        expect.assertions(1)
        const healthAuthorityAdviceUrl = ""
        const healthAuthorityLearnMoreUrl = ""

        const { queryByText } = render(
          <ConfigurationContext.Provider
            value={factories.configurationContext.build({
              healthAuthorityAdviceUrl,
              healthAuthorityLearnMoreUrl,
            })}
          >
            <NoExposures />
          </ConfigurationContext.Provider>,
        )

        expect(queryByText("Learn More")).toBeNull()
      })
    })
  })
})
