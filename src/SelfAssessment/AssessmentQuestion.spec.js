import { fireEvent, render } from "@testing-library/react-native"
import React from "react"
import { I18nextProvider } from "react-i18next"

import i18n from "../locales/languages"
import { AnswersContext } from "./Context"
import { AssessmentQuestion } from "./AssessmentQuestion"
import {
  QUESTION_TYPE_MULTI,
  QUESTION_TYPE_TEXT,
  SCREEN_TYPE_CHECKBOX,
  SCREEN_TYPE_RADIO,
} from "./constants"

describe("AssessmentQuestion", () => {
  it("supports line breaks in the description", () => {
    const firstDescription = "firstDescription"
    const secondDescription = "secondDescription"

    const { queryAllByTestId, getByText } = render(
      <I18nextProvider i18n={i18n}>
        <AnswersContext.Provider value={{}}>
          <AssessmentQuestion
            onChange={jest.fn()}
            onNext={jest.fn()}
            option={{ values: [] }}
            question={{
              question_description: `${firstDescription}\n${secondDescription}`,
            }}
          />
        </AnswersContext.Provider>
      </I18nextProvider>,
    )

    expect(queryAllByTestId("description")).toHaveLength(2)
    expect(getByText(firstDescription)).toBeDefined()
    expect(getByText(secondDescription)).toBeDefined()
  })

  it("on a type text question it calls the on change function with the answer values", () => {
    const question = {
      option_key: "option_1",
      question_key: "1",
      question_text: "What is the answer?",
      question_type: QUESTION_TYPE_TEXT,
      required: false,
      screen_type: SCREEN_TYPE_RADIO,
    }
    const option = {
      key: "option_1",
      values: [
        {
          label: "A",
          value: "0",
        },
        {
          label: "B",
          value: "1",
        },
      ],
    }
    const onChangeSpy = jest.fn()

    const { queryAllByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <AnswersContext.Provider value={{}}>
          <AssessmentQuestion
            onChange={onChangeSpy}
            onNext={jest.fn()}
            question={question}
            option={option}
          />
        </AnswersContext.Provider>
      </I18nextProvider>,
    )

    fireEvent.press(queryAllByTestId("option")[0])
    expect(onChangeSpy).toHaveBeenCalledWith([{ index: 0, value: "0" }])
    fireEvent.press(queryAllByTestId("option")[1])
    expect(onChangeSpy).toHaveBeenCalledWith([{ index: 1, value: "1" }])
  })

  it("sends the right option values on multi select questions", () => {
    const onChangeSpy = jest.fn()

    const option = {
      key: "option_1",
      values: [
        {
          label: "A",
          value: "0",
        },
        {
          label: "B",
          value: "1",
        },
      ],
    }

    const { queryAllByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <AnswersContext.Provider value={{}}>
          <AssessmentQuestion
            onChange={onChangeSpy}
            onNext={jest.fn()}
            option={option}
            question={{
              question_type: QUESTION_TYPE_MULTI,
              screen_type: SCREEN_TYPE_CHECKBOX,
            }}
          />
        </AnswersContext.Provider>
      </I18nextProvider>,
    )

    fireEvent.press(queryAllByTestId("option")[0])
    expect(onChangeSpy).toHaveBeenCalledWith([{ index: 0, value: "0" }])
    fireEvent.press(queryAllByTestId("option")[1])
    expect(onChangeSpy).toHaveBeenCalledWith([
      { index: 0, value: "0" },
      { index: 1, value: "1" },
    ])
    fireEvent.press(queryAllByTestId("option")[0])
    expect(onChangeSpy).toHaveBeenCalledWith([{ index: 1, value: "1" }])
  })
})
