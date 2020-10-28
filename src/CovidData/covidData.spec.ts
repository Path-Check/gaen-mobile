import { factories } from "../factories"
import { toNewCasesPercentage } from "./covidData"

describe("toNewCasesPercentage", () => {
  describe("when there has been no change in cases", () => {
    it("return 0", () => {
      const covidData = [
        factories.covidDatum.build({ positiveCasesNew: 100 }),
        factories.covidDatum.build({ positiveCasesNew: 100 }),
        factories.covidDatum.build({ positiveCasesNew: 100 }),
      ]

      expect(toNewCasesPercentage(covidData)).toEqual(0)
    })
  })
  describe("when there has been a positive change in cases", () => {
    it("returns a positive percentage", () => {
      const covidData = [
        factories.covidDatum.build({ positiveCasesNew: 110 }),
        factories.covidDatum.build({ positiveCasesNew: 100 }),
        factories.covidDatum.build({ positiveCasesNew: 100 }),
      ]

      expect(toNewCasesPercentage(covidData)).toEqual(10)
    })
  })

  describe("when there has been a negative change in cases", () => {
    it("returns a negative percentage", () => {
      const covidData = [
        factories.covidDatum.build({ positiveCasesNew: 90 }),
        factories.covidDatum.build({ positiveCasesNew: 100 }),
        factories.covidDatum.build({ positiveCasesNew: 100 }),
      ]

      expect(toNewCasesPercentage(covidData)).toEqual(-10)
    })
  })
})
