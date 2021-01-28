import { phoneToFormattedString } from "./UserDetailsForm"

describe("phoneToFormattedString", () => {
  describe("when given a phonenumber", () => {
    it("adds parenteses and a dash, and pads missing digits with asterisks", () => {
      const number1 = ""
      const number2 = "1"
      const number3 = "123"
      const number4 = "123456"
      const number5 = "1234567890"
      const number6 = "123456789012345"

      const result1 = phoneToFormattedString(number1)
      const result2 = phoneToFormattedString(number2)
      const result3 = phoneToFormattedString(number3)
      const result4 = phoneToFormattedString(number4)
      const result5 = phoneToFormattedString(number5)
      const result6 = phoneToFormattedString(number6)

      const expected1 = "(***) ***-****"
      const expected2 = "(1**) ***-****"
      const expected3 = "(123) ***-****"
      const expected4 = "(123) 456-****"
      const expected5 = "(123) 456-7890"
      const expected6 = "(123) 456-7890"

      expect(result1).toEqual(expected1)
      expect(result2).toEqual(expected2)
      expect(result3).toEqual(expected3)
      expect(result4).toEqual(expected4)
      expect(result5).toEqual(expected5)
      expect(result6).toEqual(expected6)
    })
  })
})
