import React, {
  createContext,
  useContext,
  useState,
  FunctionComponent,
} from "react"

const TestModeContext = createContext<TestModeContextState | undefined>(
  undefined,
)

interface TestModeContextState {
  testModeEnabled: boolean
  toggleTestModeEnabled: () => void
}

export const TestModeProvider: FunctionComponent = ({ children }) => {
  const [testModeEnabled, setTestModeEnabled] = useState(false)

  const toggleTestModeEnabled = () => {
    setTestModeEnabled(!testModeEnabled)
  }

  return (
    <TestModeContext.Provider
      value={{ testModeEnabled, toggleTestModeEnabled }}
    >
      {children}
    </TestModeContext.Provider>
  )
}

export const useTestModeContext = (): TestModeContextState => {
  const context = useContext(TestModeContext)
  if (context === undefined) {
    throw new Error("TestModeContext must be used with a provider")
  }
  return context
}
