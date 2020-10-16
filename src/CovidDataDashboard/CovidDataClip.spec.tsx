import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import CovidDataClip from "./CovidDataClip"
import { factories } from "../factories"
import { CovidDataContext, CovidDataRequestStatus } from "../CovidDataContext"
import { calculateCasesPercentageTrend } from "./covidData"
import { HomeStackScreens } from "../navigation"

jest.mock("@react-navigation/native")
describe("CovidDataClip", () => {
  describe("when there is info missing to get the data", () => {
    it("shows an error with that info", () => {
      const covidDataContext = factories.covidDataContext.build({
        covidDataRequest: {
          status: CovidDataRequestStatus.MISSING_INFO,
        },
      })

      const { getByText } = render(
        <CovidDataContext.Provider value={covidDataContext}>
          <CovidDataClip />
        </CovidDataContext.Provider>,
      )

      expect(getByText("Apologies, COVID data is unavailable.")).toBeDefined()
    })
  })

  describe("when the data request is loading", () => {
    it("displays a loading spinner", () => {
      const covidDataContext = factories.covidDataContext.build({
        covidDataRequest: {
          status: CovidDataRequestStatus.LOADING,
        },
      })

      const { getByTestId } = render(
        <CovidDataContext.Provider value={covidDataContext}>
          <CovidDataClip />
        </CovidDataContext.Provider>,
      )

      expect(getByTestId("loading-indicator")).toBeDefined()
    })
  })

  describe("when the data request failed", () => {
    it("displays an error message", () => {
      const stateAbbreviation = "state"
      const covidDataContext = factories.covidDataContext.build({
        stateAbbreviation,
        covidDataRequest: {
          status: CovidDataRequestStatus.ERROR,
        },
      })

      const { getByText } = render(
        <CovidDataContext.Provider value={covidDataContext}>
          <CovidDataClip />
        </CovidDataContext.Provider>,
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
      const trendReferenceData = factories.covidData.build({
        peoplePositiveNewCasesCt: 8,
      })
      const collectionForTrend = [
        trendReferenceData,
        factories.covidData.build({ peoplePositiveNewCasesCt: 10 }),
      ]
      const covidDataContext = factories.covidDataContext.build({
        stateAbbreviation,
        covidDataRequest: {
          status: CovidDataRequestStatus.SUCCESS,
          trendReferenceData,
          collectionForTrend,
        },
      })
      const percentageChange = calculateCasesPercentageTrend(
        trendReferenceData,
        collectionForTrend,
      )

      const { getByText } = render(
        <CovidDataContext.Provider value={covidDataContext}>
          <CovidDataClip />
        </CovidDataContext.Provider>,
      )

      expect(getByText(`${Math.abs(percentageChange)}%`)).toBeDefined()
      expect(
        getByText(`COVID Stats in ${stateAbbreviation.toUpperCase()}`),
      ).toBeDefined()
    })

    it("allows users to navigate to the data dashboard", async () => {
      const trendReferenceData = factories.covidData.build({
        peoplePositiveNewCasesCt: 8,
      })
      const covidDataContext = factories.covidDataContext.build({
        covidDataRequest: {
          status: CovidDataRequestStatus.SUCCESS,
          trendReferenceData,
          collectionForTrend: [
            factories.covidData.build({ peoplePositiveNewCasesCt: 10 }),
          ],
        },
      })
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })

      const { getByLabelText } = render(
        <CovidDataContext.Provider value={covidDataContext}>
          <CovidDataClip />
        </CovidDataContext.Provider>,
      )

      fireEvent.press(getByLabelText("See more"))

      expect(navigateSpy).toHaveBeenCalledWith(
        HomeStackScreens.CovidDataDashboard,
      )
    })

    describe("when the cases count is dropping", () => {
      it("displays a message about the cases trending down", async () => {
        const trendReferenceData = factories.covidData.build({
          peoplePositiveNewCasesCt: 8,
        })
        const covidDataContext = factories.covidDataContext.build({
          covidDataRequest: {
            status: CovidDataRequestStatus.SUCCESS,
            trendReferenceData,
            collectionForTrend: [
              factories.covidData.build({ peoplePositiveNewCasesCt: 10 }),
            ],
          },
        })

        const { getByText } = render(
          <CovidDataContext.Provider value={covidDataContext}>
            <CovidDataClip />
          </CovidDataContext.Provider>,
        )

        expect(getByText("Down from last week")).toBeDefined()
      })
    })

    describe("when the cases count is increasing", () => {
      it("displays a message about the cases trending upward", async () => {
        const trendReferenceData = factories.covidData.build({
          peoplePositiveNewCasesCt: 10,
        })
        const covidDataContext = factories.covidDataContext.build({
          covidDataRequest: {
            status: CovidDataRequestStatus.SUCCESS,
            trendReferenceData,
            collectionForTrend: [
              factories.covidData.build({ peoplePositiveNewCasesCt: 8 }),
            ],
          },
        })

        const { getByText } = render(
          <CovidDataContext.Provider value={covidDataContext}>
            <CovidDataClip />
          </CovidDataContext.Provider>,
        )

        expect(getByText("Up from last week")).toBeDefined()
      })
    })
  })
})
