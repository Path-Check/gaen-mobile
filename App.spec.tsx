import React from "react"
import { cleanup, render } from "@testing-library/react-native"
import App from "./App"
import { onboardingHasBeenCompleted } from "./src/OnboardingContext"

afterEach(cleanup)

describe("when the user has completed onboarding", () => {
  ;(onboardingHasBeenCompleted as jest.Mock).mockResolvedValue(true)
  it("displays the home screen", () => {
    expect.assertions(1)
    const { getByText } = render(<App />)
    expect(getByText("Exposure Notifications Disabled")).toBeDefined()
  })
})
