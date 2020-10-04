import React from "react"
import { render, waitFor } from "@testing-library/react-native"
import dayjs from "dayjs"
import "@testing-library/jest-native/extend-expect"

import DateInfoHeader from "./DateInfoHeader"

jest.mock("../../gaen/nativeModule.ts")

describe("DateInfoHeader", () => {
  afterEach(() => jest.resetAllMocks())
  it("displays the time since the last exposure detection", async () => {
    const lastDetectionDate = dayjs().subtract(8, "hour").valueOf()

    const { getByText } = render(
      <DateInfoHeader lastDetectionDate={lastDetectionDate} />,
    )

    await waitFor(() => {
      expect(getByText(/ • Updated 8 hours ago/)).toBeDefined()
    })
  })

  describe("when there is not an exposure detection date", () => {
    it("does not displays the date info", async () => {
      const lastDetectionDate = null
      const { queryByText } = render(
        <DateInfoHeader lastDetectionDate={lastDetectionDate} />,
      )

      await waitFor(() => {
        expect(queryByText("Updated")).toBeNull()
      })
    })
  })
})
