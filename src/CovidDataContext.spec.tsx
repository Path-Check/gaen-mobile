import React, { FunctionComponent } from "react"
import { Text } from "react-native"

import {
  useCovidDataContext,
  CovidDataContextProvider,
  CovidDataRequestStatus,
} from "./CovidDataContext"
import { factories } from "./factories"
import { fetchCovidDataForState } from "./CovidDataDashboard/covidDataAPI"
import { render, waitFor } from "@testing-library/react-native"
import { ConfigurationContext } from "./ConfigurationContext"

jest.mock("./CovidDataDashboard/covidDataAPI.ts")
describe("CovidDataContextProvider", () => {
  it("doesn't start the request if it should not be requested", async () => {
    const configurationContext = factories.configurationContext.build({
      displayCovidData: false,
      stateAbbreviation: "state",
    })

    const { getByTestId } = render(
      <ConfigurationContext.Provider value={configurationContext}>
        <CovidDataContextProvider>
          <CovidDataContextSpoof />
        </CovidDataContextProvider>
      </ConfigurationContext.Provider>,
    )

    await waitFor(() => {
      expect(getByTestId("status").children).toEqual([
        CovidDataRequestStatus.MISSING_INFO.toString(),
      ])
    })
  })

  it("doesn't start the request if required data is missing", async () => {
    const configurationContext = factories.configurationContext.build({
      displayCovidData: true,
      stateAbbreviation: null,
    })

    const { getByTestId } = render(
      <ConfigurationContext.Provider value={configurationContext}>
        <CovidDataContextProvider>
          <CovidDataContextSpoof />
        </CovidDataContextProvider>
      </ConfigurationContext.Provider>,
    )

    await waitFor(() => {
      expect(getByTestId("status").children).toEqual([
        CovidDataRequestStatus.MISSING_INFO.toString(),
      ])
    })
  })

  it("fetches the data if required arguments are present", async () => {
    const configurationContext = factories.configurationContext.build({
      displayCovidData: true,
      stateAbbreviation: "state",
    })

    const todayData = factories.covidData.build({ peoplePositiveCasesCt: 4 })
    const trendReferenceData = factories.covidData.build({
      peoplePositiveCasesCt: 3,
    })
    const collectionForTrend = [
      trendReferenceData,
      factories.covidData.build({ peoplePositiveCasesCt: 2 }),
      factories.covidData.build({ peoplePositiveCasesCt: 1 }),
    ]

    const lastWeekCovidData = [...collectionForTrend, todayData]

    ;(fetchCovidDataForState as jest.Mock).mockResolvedValueOnce({
      kind: "success",
      lastWeekCovidData,
    })

    const { getByTestId } = render(
      <ConfigurationContext.Provider value={configurationContext}>
        <CovidDataContextProvider>
          <CovidDataContextSpoof />
        </CovidDataContextProvider>
      </ConfigurationContext.Provider>,
    )

    expect(getByTestId("status").children).toEqual([
      CovidDataRequestStatus.LOADING.toString(),
    ])

    await waitFor(() => {
      expect(getByTestId("status").children).toEqual([
        CovidDataRequestStatus.SUCCESS.toString(),
      ])
      expect(getByTestId("todayData").children).toEqual([
        JSON.stringify(todayData),
      ])
      expect(getByTestId("trendReferenceData").children).toEqual([
        JSON.stringify(trendReferenceData),
      ])
      expect(getByTestId("collectionForTrend").children).toEqual([
        JSON.stringify(collectionForTrend),
      ])
    })
  })

  describe("when the response is incomplete", () => {
    it("sets the status as missing information", async () => {
      const configurationContext = factories.configurationContext.build({
        displayCovidData: true,
        stateAbbreviation: "state",
      })

      const lastWeekCovidData = [
        factories.covidData.build({ peoplePositiveCasesCt: 1 }),
      ]

      ;(fetchCovidDataForState as jest.Mock).mockResolvedValueOnce({
        kind: "success",
        lastWeekCovidData,
      })

      const { getByTestId } = render(
        <ConfigurationContext.Provider value={configurationContext}>
          <CovidDataContextProvider>
            <CovidDataContextSpoof />
          </CovidDataContextProvider>
        </ConfigurationContext.Provider>,
      )

      expect(getByTestId("status").children).toEqual([
        CovidDataRequestStatus.LOADING.toString(),
      ])

      await waitFor(() => {
        expect(getByTestId("status").children).toEqual([
          CovidDataRequestStatus.MISSING_INFO.toString(),
        ])
      })
    })
  })

  it("sets the status as an error when the request fails", async () => {
    const configurationContext = factories.configurationContext.build({
      displayCovidData: true,
      stateAbbreviation: "state",
    })

    ;(fetchCovidDataForState as jest.Mock).mockResolvedValueOnce({
      kind: "failure",
    })

    const { getByTestId } = render(
      <ConfigurationContext.Provider value={configurationContext}>
        <CovidDataContextProvider>
          <CovidDataContextSpoof />
        </CovidDataContextProvider>
      </ConfigurationContext.Provider>,
    )

    expect(getByTestId("status").children).toEqual([
      CovidDataRequestStatus.LOADING.toString(),
    ])

    await waitFor(() => {
      expect(getByTestId("status").children).toEqual([
        CovidDataRequestStatus.ERROR.toString(),
      ])
    })
  })
})

const CovidDataContextSpoof: FunctionComponent = () => {
  const {
    covidDataRequest: {
      status,
      todayData,
      trendReferenceData,
      collectionForTrend,
    },
  } = useCovidDataContext()

  return (
    <>
      <Text testID="status">{status}</Text>
      <Text testID="todayData">{JSON.stringify(todayData)}</Text>
      <Text testID="trendReferenceData">
        {JSON.stringify(trendReferenceData)}
      </Text>
      <Text testID="collectionForTrend">
        {JSON.stringify(collectionForTrend)}
      </Text>
    </>
  )
}
