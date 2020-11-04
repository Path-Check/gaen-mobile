import React, { FunctionComponent } from "react"
import { Text } from "react-native"
import { render, waitFor } from "@testing-library/react-native"

import { factories } from "../factories"
import { ConfigurationContext } from "../ConfigurationContext"
import { useCovidDataContext, CovidDataContextProvider } from "./Context"
import { fetchCovidDataForState } from "./covidDataAPI"

jest.mock("./covidDataAPI.ts")
describe("CovidDataContextProvider", () => {
  it("doesn't start the request if it should not be requested", async () => {
    const configurationContext = factories.configurationContext.build({
      displayCovidData: false,
      stateAbbreviation: "state",
    })

    const { getByTestId } = render(
      <ConfigurationContext.Provider value={configurationContext}>
        <CovidDataContextProvider>
          <CovidDataConsumer />
        </CovidDataContextProvider>
      </ConfigurationContext.Provider>,
    )

    await waitFor(() => {
      expect(getByTestId("status").children).toEqual(["MISSING_INFO"])
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
          <CovidDataConsumer />
        </CovidDataContextProvider>
      </ConfigurationContext.Provider>,
    )

    await waitFor(() => {
      expect(getByTestId("status").children).toEqual(["MISSING_INFO"])
    })
  })

  it("fetches the data if required arguments are present", async () => {
    const configurationContext = factories.configurationContext.build({
      displayCovidData: true,
      stateAbbreviation: "state",
    })

    const data = factories.covidData.build()

    ;(fetchCovidDataForState as jest.Mock).mockResolvedValueOnce({
      kind: "success",
      data,
    })

    const { getByTestId } = render(
      <ConfigurationContext.Provider value={configurationContext}>
        <CovidDataContextProvider>
          <CovidDataConsumer />
        </CovidDataContextProvider>
      </ConfigurationContext.Provider>,
    )

    expect(getByTestId("status").children).toEqual(["LOADING"])

    await waitFor(() => {
      expect(getByTestId("status").children).toEqual(["SUCCESS"])
      expect(getByTestId("data").children).toEqual([JSON.stringify(data)])
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
          <CovidDataConsumer />
        </CovidDataContextProvider>
      </ConfigurationContext.Provider>,
    )

    expect(getByTestId("status").children).toEqual(["LOADING"])

    await waitFor(() => {
      expect(getByTestId("status").children).toEqual(["ERROR"])
    })
  })
})

const CovidDataConsumer: FunctionComponent = () => {
  const {
    request: { status, data },
  } = useCovidDataContext()

  return (
    <>
      <Text testID="status">{status}</Text>
      <Text testID="data">{JSON.stringify(data)}</Text>
    </>
  )
}
