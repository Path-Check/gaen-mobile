import { Factory } from "fishery"
import { SymptomHistoryState } from "../SymptomHistory/SymptomHistoryContext"

export default Factory.define<SymptomHistoryState>(() => ({
  symptomLogEntries: [],
  addLogEntry: jest.fn(),
  updateLogEntry: jest.fn(),
  deleteLogEntry: jest.fn(),
  deleteAllLogEntries: jest.fn(),
}))
