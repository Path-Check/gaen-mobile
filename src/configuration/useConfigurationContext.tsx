import { useContext } from "react"

import { Configuration } from "./configurationInterface"
import { ConfigurationContext } from "./configurationContext"

const useConfigurationContext = (): Configuration => {
  const context = useContext(ConfigurationContext)
  if (context === undefined) {
    throw new Error("ConfigurationContext must be used with a provider")
  }
  return context
}

export { useConfigurationContext }
