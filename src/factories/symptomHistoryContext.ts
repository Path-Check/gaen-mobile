import { Factory } from "fishery"
import { SymptomHistoryState } from "../SymptomHistory/SymptomHistoryContext"

export default Factory.define<SymptomHistoryState>(() => ({
  symptomHistory: [],
  updateEntry: jest.fn(),
  deleteAllEntries: jest.fn(),
}))
