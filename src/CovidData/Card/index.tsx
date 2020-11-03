import React, { FunctionComponent } from "react"

import { useCovidDataContext } from "../Context"
import CovidDataCard from "./CovidDataCard"

const CovidDataCardConnector: FunctionComponent = () => {
  const { request, locationName } = useCovidDataContext()

  return <CovidDataCard dataRequest={request} locationName={locationName} />
}

export default CovidDataCardConnector
