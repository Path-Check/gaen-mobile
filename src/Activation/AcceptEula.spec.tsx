import React from "react"
import { I18nextProvider } from "react-i18next"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import i18n from "../locales/languages"
import AcceptEula from "./AcceptEula"

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
jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("EulaModal", () => {
  it("won't continue until a user accepts the terms of use", async () => {
    const navigationSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

    const { getByLabelText, getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <AcceptEula />
      </I18nextProvider>,
    )

    const continueButton = getByLabelText("Continue")
    fireEvent.press(continueButton)

    expect(navigationSpy).not.toHaveBeenCalled()
    expect(getByLabelText("Unchecked checkbox")).toBeDefined()

    fireEvent.press(getByTestId("accept-terms-of-use-checkbox"))
    fireEvent.press(continueButton)

    await waitFor(() => {
      expect(getByLabelText("Checked checkbox")).toBeDefined()
      expect(navigationSpy).toHaveBeenCalledWith("ActivateProximityTracing")
    })
  })
})

