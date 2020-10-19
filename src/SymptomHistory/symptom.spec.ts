import {
  all,
  hasEmergencySymptoms,
  Symptom,
  emergencySymptoms,
} from "./symptom"

describe("hasEmergencySymptoms", () => {
  describe("when the set of logged symptoms has emergency ones", () => {
    it("returns true", () => {
      emergencySymptoms.forEach((emergencySymptom) => {
        const loggedSymptomsWithEmergency = new Set<Symptom>([emergencySymptom])

        expect(hasEmergencySymptoms(loggedSymptomsWithEmergency)).toBeTruthy()
      })
    })
  })

  describe("when the set of logged symptoms has none emergency ones", () => {
    it("returns false", () => {
      const nonEmergencySymptoms = all.filter((symptom) => {
        return !emergencySymptoms.includes(symptom)
      })
      nonEmergencySymptoms.forEach((emergencySymptom) => {
        const loggedSymptomsWithEmergency = new Set<Symptom>([emergencySymptom])

        expect(hasEmergencySymptoms(loggedSymptomsWithEmergency)).toBeFalsy()
      })
    })
  })
})
