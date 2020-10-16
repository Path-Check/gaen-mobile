import { CovidData } from "./covidDataAPI"

const percentageChange = (average: number, todayCases: number) => {
  return Math.round((1 - average / todayCases) * 100)
}

export const calculateCasesPercentageTrend = (
  trendReferenceData: CovidData,
  collectionForTrend: CovidData[],
): number => {
  if (collectionForTrend.length === 0) {
    return 0
  }
  const sumOfNewCases = collectionForTrend.reduce((sum, covidData) => {
    return sum + covidData.peoplePositiveNewCasesCt
  }, 0)
  const averageOfNewCases = sumOfNewCases / collectionForTrend.length

  const newCasesToday = trendReferenceData.peoplePositiveNewCasesCt

  return percentageChange(averageOfNewCases, newCasesToday)
}
