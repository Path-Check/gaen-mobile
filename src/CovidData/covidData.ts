export type CovidData = CovidDatum[]

export const empty: CovidDatum = {
  date: "2020-01-01",
  positiveCasesTotal: 0,
  positiveCasesNew: 0,
  deathsTotal: 0,
  deathsNew: 0,
}

type Date = string

export type CovidDatum = {
  date: Date
  positiveCasesTotal: number
  positiveCasesNew: number
  deathsTotal: number
  deathsNew: number
}

export const toNewCasesPercentage = (data: CovidData): number | null => {
  if (!(data.length > 1)) {
    return null
  }

  const positiveNew = data.map(toPositiveNew)
  const [today, ...previous] = positiveNew
  const sumPrevious = previous.reduce((a, b) => a + b, 0)
  const average = sumPrevious / (data.length - 1)

  return percentDifference(today, average)
}

const toPositiveNew = (datum: CovidDatum): number => {
  return datum.positiveCasesNew
}

const percentDifference = (a: number, b: number) => {
  const result = Math.round(((a - b) / b) * 100)
  return result
}

type TrendData = number[]

export const toLineChartCasesNew = (data: CovidData): TrendData => {
  return data.map(toCasesNew).slice(0, 7)
}

export const toCasesNew = (datum: CovidDatum): number => {
  return datum.positiveCasesNew
}
