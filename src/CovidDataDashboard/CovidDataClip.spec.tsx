import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import CovidDataClip from "./CovidDataClip"
import { factories } from "../factories"
import { ConfigurationContext } from "../ConfigurationContext"
import { CovidDataContext, CovidDataRequestStatus } from "../CovidDataContext"
import { calculateCasesPercentageTrend } from "./covidData"
import { HomeStackScreens, Stacks } from "../navigation"

jest.mock("@react-navigation/native")
describe("CovidDataClip", () => {
  describe("when no state abbreviation is provided", () => {
    it("does not render anything", () => {
      const configurationContext = factories.configurationContext.build({
        stateAbbreviation: null,
      })
      const covidDataContext = factories.covidDataContext.build()

      const container = render(
        <ConfigurationContext.Provider value={configurationContext}>
          <CovidDataContext.Provider value={covidDataContext}>
            <CovidDataClip />
          </CovidDataContext.Provider>
        </ConfigurationContext.Provider>,
      )

      expect(container.toJSON()).toBeNull()
    })
  })

  describe("when the data request is loading", () => {
    it("displays a loading spinner", () => {
      const configurationContext = factories.configurationContext.build({
        stateAbbreviation: "state",
      })
      const covidDataContext = factories.covidDataContext.build({
        covidDataRequest: {
          status: CovidDataRequestStatus.LOADING,
        },
      })

      const { getByTestId } = render(
        <ConfigurationContext.Provider value={configurationContext}>
          <CovidDataContext.Provider value={covidDataContext}>
            <CovidDataClip />
          </CovidDataContext.Provider>
        </ConfigurationContext.Provider>,
      )

      expect(getByTestId("loading-indicator")).toBeDefined()
    })
  })

  describe("when the data request failed", () => {
    it("displays an error message", () => {
      const stateAbbreviation = "state"
      const configurationContext = factories.configurationContext.build({
        stateAbbreviation,
      })
      const covidDataContext = factories.covidDataContext.build({
        covidDataRequest: {
          status: CovidDataRequestStatus.ERROR,
        },
      })

      const { getByText } = render(
        <ConfigurationContext.Provider value={configurationContext}>
          <CovidDataContext.Provider value={covidDataContext}>
            <CovidDataClip />
          </CovidDataContext.Provider>
        </ConfigurationContext.Provider>,
      )

      expect(
        getByText(
          `Sorry, we could not fetch the latest COVID cases data for ${stateAbbreviation}.`,
        ),
      ).toBeDefined()
    })
  })

  describe("when the request has completed successfuly", () => {
    it("displays the change in the trend", async () => {
      const stateAbbreviation = "state"
      const configurationContext = factories.configurationContext.build({
        stateAbbreviation,
      })
      const covidData = [
        factories.covidData.build({ peoplePositiveNewCasesCt: 8 }),
        factories.covidData.build({ peoplePositiveNewCasesCt: 10 }),
      ]
      const covidDataContext = factories.covidDataContext.build({
        covidDataRequest: {
          status: CovidDataRequestStatus.SUCCESS,
          data: covidData,
        },
      })
      const percentageChange = calculateCasesPercentageTrend(covidData)

      const { getByText } = render(
        <ConfigurationContext.Provider value={configurationContext}>
          <CovidDataContext.Provider value={covidDataContext}>
            <CovidDataClip />
          </CovidDataContext.Provider>
        </ConfigurationContext.Provider>,
      )

      expect(getByText(`${Math.abs(percentageChange)}%`)).toBeDefined()
      expect(
        getByText(`COVID Stats in ${stateAbbreviation.toUpperCase()}`),
      ).toBeDefined()
    })

    it("allows users to navigate to the data dashboard", async () => {
      const configurationContext = factories.configurationContext.build({
        stateAbbreviation: "state",
      })
      const covidDataContext = factories.covidDataContext.build({
        covidDataRequest: {
          status: CovidDataRequestStatus.SUCCESS,
          data: [
            factories.covidData.build({ peoplePositiveNewCasesCt: 8 }),
            factories.covidData.build({ peoplePositiveNewCasesCt: 10 }),
          ],
        },
      })
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })

      const { getByLabelText } = render(
        <ConfigurationContext.Provider value={configurationContext}>
          <CovidDataContext.Provider value={covidDataContext}>
            <CovidDataClip />
          </CovidDataContext.Provider>
        </ConfigurationContext.Provider>,
      )

      fireEvent.press(getByLabelText("See more"))

      expect(navigateSpy).toHaveBeenCalledWith(Stacks.Modal, {
        screen: HomeStackScreens.CovidDataDashboard,
      })
    })

    describe("when the cases count is dropping", () => {
      it("displays a message about the cases trending down", async () => {
        const configurationContext = factories.configurationContext.build({
          stateAbbreviation: "state",
        })
        const covidDataContext = factories.covidDataContext.build({
          covidDataRequest: {
            status: CovidDataRequestStatus.SUCCESS,
            data: [
              factories.covidData.build({ peoplePositiveNewCasesCt: 8 }),
              factories.covidData.build({ peoplePositiveNewCasesCt: 10 }),
            ],
          },
        })

        const { getByText } = render(
          <ConfigurationContext.Provider value={configurationContext}>
            <CovidDataContext.Provider value={covidDataContext}>
              <CovidDataClip />
            </CovidDataContext.Provider>
          </ConfigurationContext.Provider>,
        )

        expect(getByText("Down from last week")).toBeDefined()
      })
    })

    describe("when the cases count is increasing", () => {
      it("displays a message about the cases trending upward", async () => {
        const configurationContext = factories.configurationContext.build({
          stateAbbreviation: "state",
        })
        const covidDataContext = factories.covidDataContext.build({
          covidDataRequest: {
            status: CovidDataRequestStatus.SUCCESS,
            data: [
              factories.covidData.build({ peoplePositiveNewCasesCt: 10 }),
              factories.covidData.build({ peoplePositiveNewCasesCt: 8 }),
            ],
          },
        })

        const { getByText } = render(
          <ConfigurationContext.Provider value={configurationContext}>
            <CovidDataContext.Provider value={covidDataContext}>
              <CovidDataClip />
            </CovidDataContext.Provider>
          </ConfigurationContext.Provider>,
        )

        expect(getByText("Up from last week")).toBeDefined()
      })
    })
  })
})
