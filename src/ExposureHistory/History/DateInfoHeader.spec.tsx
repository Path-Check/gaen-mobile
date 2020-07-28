import React from "react"
import { render, wait } from "@testing-library/react-native"
import dayjs from "dayjs"
import "@testing-library/jest-native/extend-expect"

import DateInfoHeader from "./DateInfoHeader"

describe("DateInfoHeader", () => {
  it("displays the time since the last exposure detection", async () => {
    const lastDetectionDate = dayjs().subtract(8, "hour").valueOf()

    const { getByText } = render(
      <DateInfoHeader lastDetectionDate={lastDetectionDate} />,
    )

    await wait(() => {
      expect(
        getByText(" • Updated 8 hours ago", { exact: false }),
      ).toBeDefined()
    })
  })

  describe("when there is not an exposure detection date", () => {
    it("does not displays the date info", async () => {
      const lastDetectionDate = null
      const { queryByText } = render(
        <DateInfoHeader lastDetectionDate={lastDetectionDate} />,
      )

      await wait(() => {
        expect(queryByText("Updated")).toBeNull()
      })
    })
  })
})
