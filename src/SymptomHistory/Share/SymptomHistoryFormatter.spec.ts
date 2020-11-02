import { TFunction } from "i18next"

import { Symptom } from "../symptom"
import { SymptomHistory } from "../symptomHistory"

import SymptomHistoryFormatter from "./SymptomHistoryFormatter"

describe("SymptomHistoryFormatter::forSharing", () => {
  describe("When initialized with a sympotom history", () => {
    it("returns the correct serialization", () => {
      const today = Date.parse("2020-1-3")
      const oneDayAgo = Date.parse("2020-1-2")
      const twoDaysAgo = Date.parse("2020-1-1")
      const history: SymptomHistory = [
        {
          kind: "NoUserInput",
          date: today,
        },
        {
          id: "a",
          kind: "UserInput",
          date: oneDayAgo,
          symptoms: new Set<Symptom>(),
        },
        {
          id: "b",
          kind: "UserInput",
          date: twoDaysAgo,
          symptoms: new Set<Symptom>(["cough", "fever_or_chills"]),
        },
      ]

      const t: TFunction = (
        translationString: string,
        args: string | undefined,
      ) => {
        let argsText = ""
        if (args) {
          argsText = Object.values(args).join("")
        }
        return translationString + argsText
      }

      const result = SymptomHistoryFormatter.forSharing(t, history)

      const expected = [
        "symptom_history.sharing.headerFri Jan 3, 2020Wed Jan 1, 2020",
        "Fri Jan 3, 2020\nsymptom_history.sharing.no_symptoms_were_logged",
        "Thu Jan 2, 2020\nsymptom_history.sharing.you_felt_well",
        "Wed Jan 1, 2020\nsymptom_history.sharing.you_did_not_feel_wellsymptom.cough, symptom.fever_or_chills",
      ].join("\n\n")

      expect(result).toEqual(expected)
    })
  })
})
