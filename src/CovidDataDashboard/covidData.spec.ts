import { factories } from "../factories"
import { calculateCasesPercentageTrend } from "./covidData"

describe("calculateCasesPercentageTrend", () => {
  it("returns a positive percentage trend when the cases are growing", () => {
    const trendReferenceData = factories.covidData.build({
      peoplePositiveNewCasesCt: 10,
    })
    const collectionForTrend = [
      factories.covidData.build({
        peoplePositiveNewCasesCt: 6,
      }),
      factories.covidData.build({
        peoplePositiveNewCasesCt: 6,
      }),
    ]

    expect(
      calculateCasesPercentageTrend(trendReferenceData, collectionForTrend),
    ).toEqual(40)
  })

  it("returns a negative percentage trend when the cases are shrinking", () => {
    const trendReferenceData = factories.covidData.build({
      peoplePositiveNewCasesCt: 6,
    })
    const collectionForTrend = [
      factories.covidData.build({
        peoplePositiveNewCasesCt: 10,
      }),
      factories.covidData.build({
        peoplePositiveNewCasesCt: 10,
      }),
    ]

    expect(
      calculateCasesPercentageTrend(trendReferenceData, collectionForTrend),
    ).toEqual(-67)
  })
})
