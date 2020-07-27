import { cleanup } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

afterEach(cleanup)
jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

// TODO add specs for history page
describe("History", () => {})
