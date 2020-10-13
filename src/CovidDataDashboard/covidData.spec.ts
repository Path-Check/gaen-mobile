import { factories } from "../factories"
import { calculateCasesPercentageTrend } from "./covidData"

describe("calculateCasesPercentageTrend", () => {
  it("returns a positive percentage trend when the cases are growing", () => {
    const todayData = factories.covidData.build({
      peoplePositiveNewCasesCt: 10,
    })
    const pastData = [
      factories.covidData.build({
        peoplePositiveNewCasesCt: 6,
      }),
      factories.covidData.build({
        peoplePositiveNewCasesCt: 6,
      }),
    ]

    const cumulativeData = [todayData, ...pastData]

    expect(calculateCasesPercentageTrend(cumulativeData)).toEqual(40)
  })

  it("returns a negative percentage trend when the cases are shrinking", () => {
    const todayData = factories.covidData.build({
      peoplePositiveNewCasesCt: 6,
    })
    const pastData = [
      factories.covidData.build({
        peoplePositiveNewCasesCt: 10,
      }),
      factories.covidData.build({
        peoplePositiveNewCasesCt: 10,
      }),
    ]

    const cumulativeData = [todayData, ...pastData]

    expect(calculateCasesPercentageTrend(cumulativeData)).toEqual(-67)
  })
})
