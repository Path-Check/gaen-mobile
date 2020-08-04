import React from "react"
import { render, cleanup } from "@testing-library/react-native"
import NoExposures from "./NoExposures"

jest.mock("react-native-config", () => {
  return {
    GAEN_AUTHORITY_NAME: "Minnesota",
    AUTHORITY_ADVICE_URL: "minnesota.com",
  }
})
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
      jest.resetAllMocks()

      const { queryByText } = render(<NoExposures />)

      expect(queryByText("Review guidance from Minnesota")).not.toBeNull()
      expect(queryByText("Learn More")).not.toBeNull()
    })
  })
})
