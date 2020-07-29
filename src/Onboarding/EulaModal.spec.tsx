import React from "react"
import { I18nextProvider } from "react-i18next"
import { render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import i18n from "../locales/languages"
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
jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("EulaModal", () => {
  it("adds an accessible close button", () => {
    const { getByLabelText } = render(
      <I18nextProvider i18n={i18n}>
        <EulaModal />
      </I18nextProvider>,
    )

    expect(getByLabelText("Close")).toBeDefined()
  })
})
