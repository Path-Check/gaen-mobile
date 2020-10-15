import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { SymptomHistoryContext } from "./SymptomHistoryContext"
import { SymptomEntry } from "./symptomHistory"

import SymptomHistory from "./index"
import { factories } from "../factories"
import { posixToDayjs } from "../utils/dateTime"
import { SymptomHistoryStackScreens } from "../navigation"

jest.mock("@react-navigation/native")

// when the given entry is no data it shows no data.
// when the given entry is no symptoms it shows no symptoms
// when the given entry symptoms is hows symptoms
// when the user taps the card, they are navigated to the select symptoms form and passes the correct date through the route

describe("SymptomEntryListItem", () => {
  describe("when the entry is of kind NoData", () => {
    it("indicates to the user that no entry has been made", () => {})
  })

  describe("when the entry is of kind Symptoms", () => {
    describe("when the entry has no symptoms", () => {
      it("indicates to the user that they had no symptoms that day", () => {})
    })

    describe("when the entry has symptoms", () => {
      it("displays the correct symptoms", () => {})
    })
  })
})
