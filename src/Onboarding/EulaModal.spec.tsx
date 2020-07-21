import React from "react"
import { render, fireEvent } from "@testing-library/react-native"

import EulaModal from "./EulaModal"

jest.mock("react-native-local-resource", () => {
  return {
    __esModule: true,
    default: () => {
      return jest.fn()
    },
  }
})
jest.mock("react-native-webview", () => {
  return {
    __esModule: true,
    default: function WebView() {
      return <></>
    },
  }
})
jest.mock("../locales/eula/en.html", () => {
  return "en"
})
jest.mock("../locales/eula/es_PR.html", () => {
  return "es_PR"
})
jest.mock("../locales/eula/ht.html", () => {
  return "ht"
})

describe("EulaModal", () => {
  it("won't continue until a user accepts the eula", () => {
    const continueFunctionSpy = jest.fn()

    const { getByLabelText } = render(
      <EulaModal continueFunction={continueFunctionSpy} selectedLocale="en" />,
    )
    const continueButton = getByLabelText("Continue")
    fireEvent.press(continueButton)

    expect(continueFunctionSpy).not.toHaveBeenCalled()
    fireEvent.press(getByLabelText("I accept the licensing agreement"))
    fireEvent.press(continueButton)
    expect(continueFunctionSpy).toHaveBeenCalled()
  })

  it("adds an accessible close button", () => {
    const { getByLabelText } = render(
      <EulaModal continueFunction={jest.fn()} selectedLocale="en" />,
    )

    expect(getByLabelText("Close icon")).toBeDefined()
  })
})
