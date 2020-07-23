import { fireEvent, render } from "@testing-library/react-native"
import React from "react"

import { AssessmentOption } from "./AssessmentOption"
import {
  SCREEN_TYPE_CHECKBOX,
  SCREEN_TYPE_DATE,
  SCREEN_TYPE_RADIO,
} from "./constants"

describe("AssessmentOption", () => {
  it("renders a checkbox option when the type is checkbox", () => {
    const onSelectSpy = jest.fn()
    const label = "label"
    const value = "value"

    const { getByTestId, getByText } = render(
      <AssessmentOption
        index={0}
        onSelect={onSelectSpy}
        option={{
          label,
          value,
        }}
        type={SCREEN_TYPE_CHECKBOX}
      />,
    )

    expect(getByText(label)).toBeDefined()
    fireEvent.press(getByTestId("option"))
    expect(onSelectSpy).toHaveBeenCalledWith(value)
  })

  it("renders a radio input option when the type is radio", () => {
    const onSelectSpy = jest.fn()
    const label = "label"
    const value = "value"

    const { getByText, getByTestId } = render(
      <AssessmentOption
        index={0}
        onSelect={onSelectSpy}
        option={{
          label,
          value,
        }}
        type={SCREEN_TYPE_RADIO}
      />,
    )

    expect(getByText(label)).toBeDefined()
    fireEvent.press(getByTestId("option"))
    expect(onSelectSpy).toHaveBeenCalledWith(value)
  })

  describe("on a date picker type option", () => {
    it("displays the label on it's initial state with no date selected", () => {
      const label = "label"

      const { getByText } = render(
        <AssessmentOption
          index={0}
          onSelect={jest.fn()}
          option={{
            label,
            value: "Value",
          }}
          type={SCREEN_TYPE_DATE}
        />,
      )
      expect(getByText("label")).toBeDefined()
    })

    it("displays a date picker when the user taps on the option", () => {
      const { getByTestId, queryByTestId } = render(
        <AssessmentOption
          index={0}
          onSelect={jest.fn()}
          option={{
            label: "Label",
            value: "Value",
          }}
          type={SCREEN_TYPE_DATE}
        />,
      )

      expect(queryByTestId("datepicker")).toBeNull()
      fireEvent.press(getByTestId("option"))
      expect(getByTestId("datepicker")).toBeTruthy()
    })

    describe("on iOS", () => {
      it("initializes the value with the current date after a tap", () => {
        jest.doMock("../utils/index", () => ({
          isPlatformIOS: () => true,
        }))
        const onSelectSpy = jest.fn()
        const todaysDate = new Date()
        const dateLabel = `${
          todaysDate.getMonth() + 1
        }/${todaysDate.getDate()}/${todaysDate.getFullYear()}`

        const { getByTestId, getByText } = render(
          <AssessmentOption
            index={0}
            onSelect={onSelectSpy}
            option={{
              label: "Label",
              value: "Value",
            }}
            type={SCREEN_TYPE_DATE}
          />,
        )

        fireEvent.press(getByTestId("option"))
        expect(onSelectSpy).toHaveBeenCalledWith(new Date().toDateString())
        expect(getByText(dateLabel)).toBeDefined()
      })
    })
  })
})
