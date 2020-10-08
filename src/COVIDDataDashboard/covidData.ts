import { CovidData } from "./covidDataAPI"

const percentageChange = (average: number, todayCases: number) => {
  return Math.round((1 - average / todayCases) * 100)
}

export const calculateCasesPercentageTrend = (
  cumulativeCovidData: CovidData[],
): number => {
  if (cumulativeCovidData.length === 0) {
    return 0
  }
  const [todayData, ...pastDaysData] = cumulativeCovidData
  const sumOfNewCases = pastDaysData.reduce((sum, covidData) => {
    return sum + covidData.peoplePositiveNewCasesCt
  }, 0)
  const averageOfNewCases = sumOfNewCases / pastDaysData.length

  const newCasesToday = todayData.peoplePositiveNewCasesCt

  return percentageChange(averageOfNewCases, newCasesToday)
}
