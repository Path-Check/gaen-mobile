import { useEffect, useState } from "react"

import { getVersion, getBuildNumber, getApplicationName } from "../Device"

interface ApplicationInfo {
  applicationName: string
  versionInfo: string
}

const useApplicationName = (): Pick<ApplicationInfo, "applicationName"> => {
  const [applicationName, setApplicationName] = useState("")

  const fetchApplicationName = async () => {
    const name = await getApplicationName()
    setApplicationName(name)
  }

  useEffect(() => {
    fetchApplicationName()
  }, [])

  return { applicationName }
}

const useVersionInfo = (): Pick<ApplicationInfo, "versionInfo"> => {
  const [versionInfo, setVersionInfo] = useState("")

  const fetchVersion = async () => {
    const version = await getVersion()
    const buildNumber = await getBuildNumber()
    setVersionInfo(`${version} (${buildNumber})`)
  }

  useEffect(() => {
    fetchVersion()
  }, [])

  return { versionInfo }
}

const useApplicationInfo = (): ApplicationInfo => {
  const { applicationName } = useApplicationName()
  const { versionInfo } = useVersionInfo()

  return { applicationName, versionInfo }
}

export { useApplicationInfo, useApplicationName, useVersionInfo }
