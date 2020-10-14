import { Factory } from "fishery"
import { SymptomHistoryState } from "../SymptomHistory/SymptomHistoryContext"

export default Factory.define<SymptomHistoryState>(() => ({
  symptomHistory: [],
  createEntry: jest.fn(),
  updateEntry: jest.fn(),
  deleteEntry: jest.fn(),
  deleteAllEntries: jest.fn(),
}))
