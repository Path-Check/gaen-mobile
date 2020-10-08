import { factories } from "../factories"
import {
  EmergencySymptom,
  determineSymptomGroup,
  SecondarySymptom,
  OtherSymptom,
  PrimarySymptom,
  SymptomGroup,
  UnderlyingCondition,
  AgeRange,
} from "./selfAssessment"

describe("determineSymptomGroup", () => {
  describe("when a user reports experiencing an emergency symptom", () => {
    it("returns the emergency symptom group", () => {
      expect.assertions(1)
      const answers = factories.selfAssessmentAnswers.build({
        emergencySymptoms: [EmergencySymptom.CHEST_PAIN],
      })

      expect(determineSymptomGroup(answers)).toEqual(SymptomGroup.EMERGENCY)
    })
  })

  describe("when a user is not experiencing emergency symptoms", () => {
    describe("when a user with underlying conditions is experiencing primarySymptoms", () => {
      it("returns the first primary symptom group", () => {
        expect.assertions(1)
        const answers = factories.selfAssessmentAnswers.build({
          primarySymptoms: [PrimarySymptom.FEVER_OR_CHILLS],
          underlyingConditions: [UnderlyingCondition.SMOKING],
        })

        expect(determineSymptomGroup(answers)).toEqual(SymptomGroup.PRIMARY_1)
      })
    })

    describe("when a user over 65 is experiencing primary symptoms", () => {
      it("returns the second  primary symptom group", () => {
        expect.assertions(1)
        const answers = factories.selfAssessmentAnswers.build({
          primarySymptoms: [PrimarySymptom.FEVER_OR_CHILLS],
          ageRange: AgeRange.SIXTY_FIVE_AND_OVER,
        })

        expect(determineSymptomGroup(answers)).toEqual(SymptomGroup.PRIMARY_2)
      })
    })

    describe("when a user under 65 with no underlying conditions is experiencing primary symptoms", () => {
      it("returns the third primary symptom group", () => {
        expect.assertions(1)
        const answers = factories.selfAssessmentAnswers.build({
          primarySymptoms: [PrimarySymptom.COUGH],
          ageRange: AgeRange.EIGHTEEN_TO_SIXTY_FOUR,
        })

        expect(determineSymptomGroup(answers)).toEqual(SymptomGroup.PRIMARY_3)
      })
    })

    describe("when a user under 65 with underlying conditions is experiencing secondary symptoms", () => {
      it("returns the first secondary symptom group", () => {
        expect.assertions(1)
        const answers = factories.selfAssessmentAnswers.build({
          secondarySymptoms: [SecondarySymptom.LOSS_OF_SMELL_TASTE_APPETITE],
          ageRange: AgeRange.EIGHTEEN_TO_SIXTY_FOUR,
          underlyingConditions: [UnderlyingCondition.HIGH_BLOOD_PRESSURE],
        })

        expect(determineSymptomGroup(answers)).toEqual(SymptomGroup.SECONDARY_1)
      })
    })

    describe("when a user over 65 with no underlying conditions is experiencing secondary symptoms", () => {
      it("returns the first secondary symptom group", () => {
        expect.assertions(1)

        const answers = factories.selfAssessmentAnswers.build({
          secondarySymptoms: [SecondarySymptom.ACHING],
          ageRange: AgeRange.SIXTY_FIVE_AND_OVER,
        })

        expect(determineSymptomGroup(answers)).toEqual(SymptomGroup.SECONDARY_1)
      })
    })

    describe("when a user under 65 with no underlying conditions is experiencing secondary symptoms", () => {
      it("returns the second secondary symptom group", () => {
        expect.assertions(1)

        const answers = factories.selfAssessmentAnswers.build({
          secondarySymptoms: [SecondarySymptom.LOSS_OF_SMELL_TASTE_APPETITE],
          ageRange: AgeRange.EIGHTEEN_TO_SIXTY_FOUR,
        })

        expect(determineSymptomGroup(answers)).toEqual(SymptomGroup.SECONDARY_2)
      })
    })

    describe("when a user is experiencing non-COVID symptoms", () => {
      it("returns the non-COVID symptom group", () => {
        expect.assertions(1)

        const answers = factories.selfAssessmentAnswers.build({
          otherSymptoms: [OtherSymptom.VOMITING_OR_DIARRHEA],
        })

        expect(determineSymptomGroup(answers)).toEqual(SymptomGroup.NON_COVID)
      })
    })

    describe("when a user is not experiencing any symptoms", () => {
      it("returns the asymptomatic group", () => {
        expect.assertions(1)

        const answers = factories.selfAssessmentAnswers.build({
          ageRange: AgeRange.SIXTY_FIVE_AND_OVER,
          underlyingConditions: [UnderlyingCondition.PREGNANCY],
        })

        expect(determineSymptomGroup(answers)).toEqual(
          SymptomGroup.ASYMPTOMATIC,
        )
      })
    })
  })
})
