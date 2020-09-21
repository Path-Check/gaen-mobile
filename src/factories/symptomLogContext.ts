import { Factory } from "fishery"
import { SymptomLogState } from "../MyHealth/SymptomLogContext"

export default Factory.define<SymptomLogState>(() => ({
  dailyLogData: [],
  addLogEntry: jest.fn(),
  updateLogEntry: jest.fn(),
  deleteLogEntry: jest.fn(),
}))
