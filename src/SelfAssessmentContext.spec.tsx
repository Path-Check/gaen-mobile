/* eslint-disable react-hooks/exhaustive-deps*/
import React, { useEffect, FunctionComponent } from "react"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { Text, TouchableOpacity, View } from "react-native"

import {
  SelfAssessmentContext,
  SelfAssessmentProvider,
  useSelfAssessmentContext,
} from "./SelfAssessmentContext"
import { factories } from "./factories"
import {
  AgeRange,
  EmergencySymptom,
  PrimarySymptom,
  UnderlyingCondition,
} from "./SelfAssessment/selfAssessment"
describe("SelfAssessmentContext", () => {
  describe("emergency symptoms", () => {
    it("passes down the correct emergency symptoms to its children", () => {
      const context = factories.selfAssessmentContext.build({
        emergencySymptoms: [EmergencySymptom.CHEST_PAIN],
      })

      const { queryByText } = render(
        <SelfAssessmentContext.Provider value={context}>
          <DisplayEmergencySymptoms />
        </SelfAssessmentContext.Provider>,
      )

      expect(queryByText(/CHEST_PAIN/)).not.toBeNull()
    })

    describe("updating emergency symptoms", () => {
      describe("when the emergency symptom is currently selected", () => {
        it("removes the symptom from context", async () => {
          expect.assertions(1)

          const { queryByText, getByText } = render(
            <SelfAssessmentProvider>
              <RemoveEmergencySymptom symptom={EmergencySymptom.CHEST_PAIN} />
            </SelfAssessmentProvider>,
          )

          const updateButton = getByText("Update")
          fireEvent.press(updateButton)

          await waitFor(() => {
            expect(queryByText(/CHEST_PAIN/)).toBeNull()
          })
        })
      })

      describe("when the emergency symptom is not currently selected", () => {
        it("adds the symptom to context", async () => {
          expect.assertions(1)

          const { queryByText } = render(
            <SelfAssessmentProvider>
              <AddEmergencySymptom symptom={EmergencySymptom.CHEST_PAIN} />
            </SelfAssessmentProvider>,
          )

          await waitFor(() => {
            expect(queryByText(/CHEST_PAIN/)).not.toBeNull()
          })
        })
      })
    })
  })

  describe("general symptoms", () => {
    it("passes down the current general symptoms to its children", () => {
      expect.assertions(1)

      const context = factories.selfAssessmentContext.build({
        primarySymptoms: [PrimarySymptom.COUGH],
      })
      const { queryByText } = render(
        <SelfAssessmentContext.Provider value={context}>
          <DisplayPrimarySymptoms />
        </SelfAssessmentContext.Provider>,
      )

      expect(queryByText(/COUGH/)).not.toBeNull()
    })
  })

  describe("updatating general symptoms", () => {
    describe("when the current symptom is currently selected", () => {
      it("removes the symptom from context", async () => {
        expect.assertions(1)

        const { queryByText, getByText } = render(
          <SelfAssessmentProvider>
            <RemovePrimarySymptom symptom={PrimarySymptom.FEVER_OR_CHILLS} />
          </SelfAssessmentProvider>,
        )

        const updateButton = getByText("Update")
        fireEvent.press(updateButton)

        await waitFor(() => {
          expect(queryByText(/FEVER_OR_CHILLS/)).toBeNull()
        })
      })
    })
    describe("when the current symptom is not currently selected", () => {
      it("adds the symptom to context", async () => {
        expect.assertions(1)
        const { queryByText } = render(
          <SelfAssessmentProvider>
            <AddPrimarySymptom symptom={PrimarySymptom.FEVER_OR_CHILLS} />
          </SelfAssessmentProvider>,
        )

        await waitFor(() => {
          expect(queryByText(/FEVER_OR_CHILLS/)).not.toBeNull()
        })
      })
    })
  })
})

describe("underlying conditions", () => {
  describe("getting the current underlying conditions", () => {
    it("passes down the correct conditions to its children", () => {
      expect.assertions(1)
      const context = factories.selfAssessmentContext.build({
        underlyingConditions: [UnderlyingCondition.BLOOD_DISORDER],
      })

      const { queryByText } = render(
        <SelfAssessmentContext.Provider value={context}>
          <DisplayUnderlyingConditions />
        </SelfAssessmentContext.Provider>,
      )

      expect(queryByText(/BLOOD_DISORDER/)).not.toBeNull()
    })
  })
  describe("updating underlying conditions", () => {
    describe("when the condition is currently selected", () => {
      it("removes the condition", async () => {
        expect.assertions(1)

        const { queryByText, getByText } = render(
          <SelfAssessmentProvider>
            <RemoveUnderlyingCondition
              condition={UnderlyingCondition.SMOKING}
            />
          </SelfAssessmentProvider>,
        )

        const updateButton = getByText("Update")
        fireEvent.press(updateButton)

        await waitFor(() => {
          expect(queryByText(/SMOKING/)).toBeNull()
        })
      })
    })

    describe("when the condition is not currently selected", () => {
      it("adds the symptom to context", async () => {
        expect.assertions(1)
        const { queryByText } = render(
          <SelfAssessmentProvider>
            <AddUnderlyingCondition
              condition={UnderlyingCondition.KIDNEY_DISEASE}
            />
          </SelfAssessmentProvider>,
        )

        await waitFor(() => {
          expect(queryByText(/KIDNEY_DISEASE/)).not.toBeNull()
        })
      })
    })
  })
})

describe("age range", () => {
  it("passes down the age range to its children", () => {
    const context = factories.selfAssessmentContext.build({
      ageRange: AgeRange.EIGHTEEN_TO_SIXTY_FOUR,
    })
    const { queryByText } = render(
      <SelfAssessmentContext.Provider value={context}>
        <DisplayAgeRange />
      </SelfAssessmentContext.Provider>,
    )

    expect(queryByText(/EIGHTEEN_TO_SIXTY_FOUR/)).not.toBeNull()
  })

  it("updates the age range", async () => {
    const { queryByText } = render(
      <SelfAssessmentProvider>
        <UpdateAgeRange range={AgeRange.SIXTY_FIVE_AND_OVER} />
      </SelfAssessmentProvider>,
    )

    await waitFor(() => {
      expect(queryByText(/SIXTY_FIVE_AND_OVER/)).not.toBeNull()
    })
  })
})

const DisplayAgeRange: FunctionComponent = () => {
  const { ageRange } = useSelfAssessmentContext()
  return (
    <View>
      <Text>{ageRange !== null && AgeRange[ageRange]}</Text>
    </View>
  )
}

const UpdateAgeRange: FunctionComponent<{ range: AgeRange }> = ({ range }) => {
  const { ageRange, updateAgeRange } = useSelfAssessmentContext()
  useEffect(() => {
    updateAgeRange(range)
  }, [])
  return (
    <View>
      <Text>{ageRange !== null && AgeRange[ageRange]}</Text>
    </View>
  )
}

const DisplayUnderlyingConditions: FunctionComponent = () => {
  const { underlyingConditions } = useSelfAssessmentContext()
  return (
    <View>
      {underlyingConditions.map((s) => {
        return <Text key={s}>{UnderlyingCondition[s]}</Text>
      })}
    </View>
  )
}

const AddUnderlyingCondition: FunctionComponent<{
  condition: UnderlyingCondition
}> = ({ condition }) => {
  const {
    underlyingConditions,
    updateUnderlyingConditions,
  } = useSelfAssessmentContext()

  useEffect(() => {
    updateUnderlyingConditions(condition)
  }, [])

  return (
    <View>
      {underlyingConditions.map((u) => {
        return <Text key={u}>{UnderlyingCondition[u]}</Text>
      })}
    </View>
  )
}

const RemoveUnderlyingCondition: FunctionComponent<{
  condition: UnderlyingCondition
}> = ({ condition }) => {
  const {
    underlyingConditions,
    updateUnderlyingConditions,
  } = useSelfAssessmentContext()

  useEffect(() => {
    updateUnderlyingConditions(condition)
  }, [])

  const updateCondition = () => {
    updateUnderlyingConditions(condition)
  }

  return (
    <View>
      {underlyingConditions.map((s) => {
        return <Text key={s}>{UnderlyingCondition[s]}</Text>
      })}
      <TouchableOpacity onPress={updateCondition}>
        <Text>Update</Text>
      </TouchableOpacity>
    </View>
  )
}
const DisplayEmergencySymptoms: FunctionComponent = () => {
  const { emergencySymptoms } = useSelfAssessmentContext()
  return (
    <View>
      {emergencySymptoms.map((s) => {
        return <Text key={s}>{EmergencySymptom[s]}</Text>
      })}
    </View>
  )
}

const RemoveEmergencySymptom: FunctionComponent<{
  symptom: EmergencySymptom
}> = ({ symptom }) => {
  const { emergencySymptoms, updateSymptoms } = useSelfAssessmentContext()

  useEffect(() => {
    updateSymptoms(symptom)
  }, [])

  const updateSymptom = () => {
    updateSymptoms(symptom)
  }

  return (
    <View>
      {emergencySymptoms.map((s) => {
        return <Text key={s}>{EmergencySymptom[s]}</Text>
      })}
      <TouchableOpacity onPress={updateSymptom}>
        <Text>Update</Text>
      </TouchableOpacity>
    </View>
  )
}

const AddEmergencySymptom: FunctionComponent<{ symptom: EmergencySymptom }> = ({
  symptom,
}) => {
  const { emergencySymptoms, updateSymptoms } = useSelfAssessmentContext()

  useEffect(() => {
    updateSymptoms(symptom)
  }, [])

  return (
    <View>
      {emergencySymptoms.map((s) => {
        return <Text key={s}>{EmergencySymptom[s]}</Text>
      })}
    </View>
  )
}

const DisplayPrimarySymptoms: FunctionComponent = () => {
  const { primarySymptoms } = useSelfAssessmentContext()

  return (
    <View>
      {primarySymptoms.map((s) => {
        return <Text key={s}>{s}</Text>
      })}
    </View>
  )
}

const AddPrimarySymptom: FunctionComponent<{ symptom: PrimarySymptom }> = ({
  symptom,
}) => {
  const { primarySymptoms, updateSymptoms } = useSelfAssessmentContext()

  useEffect(() => {
    updateSymptoms(symptom)
  }, [])

  return (
    <View>
      {primarySymptoms.map((s) => {
        return <Text key={s}>{s}</Text>
      })}
    </View>
  )
}

const RemovePrimarySymptom: FunctionComponent<{
  symptom: PrimarySymptom
}> = ({ symptom }) => {
  const { primarySymptoms, updateSymptoms } = useSelfAssessmentContext()

  useEffect(() => {
    updateSymptoms(symptom)
  }, [])

  const updateSymptom = () => {
    updateSymptoms(symptom)
  }

  return (
    <View>
      {primarySymptoms.map((s) => {
        return <Text key={s}>{s}</Text>
      })}
      <TouchableOpacity onPress={updateSymptom}>
        <Text>Update</Text>
      </TouchableOpacity>
    </View>
  )
}
