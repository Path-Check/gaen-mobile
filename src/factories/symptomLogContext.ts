import { Factory } from "fishery"
import { SymptomLogState } from "../MyHealth/SymptomLogContext"
import { CheckInStatus } from "../MyHealth/symptoms"

export default Factory.define<SymptomLogState>(() => ({
  todaysCheckIn: { date: Date.now(), status: CheckInStatus.NotCheckedIn },
  dailyLogData: [],
  addLogEntry: jest.fn(),
  updateLogEntry: jest.fn(),
  deleteLogEntry: jest.fn(),
  addTodaysCheckIn: jest.fn(),
}))
