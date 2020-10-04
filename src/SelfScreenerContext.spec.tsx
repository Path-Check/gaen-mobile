/* eslint-disable react-hooks/exhaustive-deps*/
import React, { useEffect, FunctionComponent } from "react"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { Text, View } from "react-native"

import {
  SelfScreenerContext,
  SelfScreenerProvider,
  useSelfScreenerContext,
} from "./SelfScreenerContext"
import { factories } from "./factories"
import { Button } from "./components"
import {
  AgeRange,
  EmergencySymptom,
  PrimarySymptom,
  UnderlyingCondition,
} from "./SelfScreener/selfScreener"
describe("SelfScreenerContext", () => {
  describe("emergency symptoms", () => {
    it("passes down the correct emergency symptoms to its children", () => {
      const context = factories.selfScreenerContext.build({
        emergencySymptoms: [EmergencySymptom.CHEST_PAIN],
      })

      const { queryByText } = render(
        <SelfScreenerContext.Provider value={context}>
          <DisplayEmergencySymptoms />
        </SelfScreenerContext.Provider>,
      )

      expect(queryByText(/CHEST_PAIN/)).not.toBeNull()
    })

    describe("updating emergency symptoms", () => {
      describe("when the emergency symptom is currently selected", () => {
        it("removes the symptom from context", async () => {
          expect.assertions(1)

          const { queryByText, getByText } = render(
            <SelfScreenerProvider>
              <RemoveEmergencySymptom symptom={EmergencySymptom.CHEST_PAIN} />
            </SelfScreenerProvider>,
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
            <SelfScreenerProvider>
              <AddEmergencySymptom symptom={EmergencySymptom.CHEST_PAIN} />
            </SelfScreenerProvider>,
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

      const context = factories.selfScreenerContext.build({
        primarySymptoms: [PrimarySymptom.COUGH],
      })
      const { queryByText } = render(
        <SelfScreenerContext.Provider value={context}>
          <DisplayPrimarySymptoms />
        </SelfScreenerContext.Provider>,
      )

      expect(queryByText(/COUGH/)).not.toBeNull()
    })
  })

  describe("updatating general symptoms", () => {
    describe("when the current symptom is currently selected", () => {
      it("removes the symptom from context", async () => {
        expect.assertions(1)

        const { queryByText, getByText } = render(
          <SelfScreenerProvider>
            <RemovePrimarySymptom symptom={PrimarySymptom.FEVER_OR_CHILLS} />
          </SelfScreenerProvider>,
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
          <SelfScreenerProvider>
            <AddPrimarySymptom symptom={PrimarySymptom.FEVER_OR_CHILLS} />
          </SelfScreenerProvider>,
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
      const context = factories.selfScreenerContext.build({
        underlyingConditions: [UnderlyingCondition.BLOOD_DISORDER],
      })

      const { queryByText } = render(
        <SelfScreenerContext.Provider value={context}>
          <DisplayUnderlyingConditions />
        </SelfScreenerContext.Provider>,
      )

      expect(queryByText(/BLOOD_DISORDER/)).not.toBeNull()
    })
  })
  describe("updating underlying conditions", () => {
    describe("when the condition is currently selected", () => {
      it("removes the condition", async () => {
        expect.assertions(1)

        const { queryByText, getByText } = render(
          <SelfScreenerProvider>
            <RemoveUnderlyingCondition
              condition={UnderlyingCondition.SMOKING}
            />
          </SelfScreenerProvider>,
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
          <SelfScreenerProvider>
            <AddUnderlyingCondition
              condition={UnderlyingCondition.KIDNEY_DISEASE}
            />
          </SelfScreenerProvider>,
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
    const context = factories.selfScreenerContext.build({
      ageRange: AgeRange.EIGHTEEN_TO_SIXTY_FOUR,
    })
    const { queryByText } = render(
      <SelfScreenerContext.Provider value={context}>
        <DisplayAgeRange />
      </SelfScreenerContext.Provider>,
    )

    expect(queryByText(/EIGHTEEN_TO_SIXTY_FOUR/)).not.toBeNull()
  })

  it("updates the age range", async () => {
    const { queryByText } = render(
      <SelfScreenerProvider>
        <UpdateAgeRange range={AgeRange.SIXTY_FIVE_AND_OVER} />
      </SelfScreenerProvider>,
    )

    await waitFor(() => {
      expect(queryByText(/SIXTY_FIVE_AND_OVER/)).not.toBeNull()
    })
  })
})

const DisplayAgeRange: FunctionComponent = () => {
  const { ageRange } = useSelfScreenerContext()
  return (
    <View>
      <Text>{ageRange !== null && AgeRange[ageRange]}</Text>
    </View>
  )
}

const UpdateAgeRange: FunctionComponent<{ range: AgeRange }> = ({ range }) => {
  const { ageRange, updateAgeRange } = useSelfScreenerContext()
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
  const { underlyingConditions } = useSelfScreenerContext()
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
  } = useSelfScreenerContext()

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
  } = useSelfScreenerContext()

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
      <Button onPress={updateCondition} label="Update" />
    </View>
  )
}
const DisplayEmergencySymptoms: FunctionComponent = () => {
  const { emergencySymptoms } = useSelfScreenerContext()
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
  const { emergencySymptoms, updateSymptoms } = useSelfScreenerContext()

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
      <Button onPress={updateSymptom} label="Update" />
    </View>
  )
}

const AddEmergencySymptom: FunctionComponent<{ symptom: EmergencySymptom }> = ({
  symptom,
}) => {
  const { emergencySymptoms, updateSymptoms } = useSelfScreenerContext()

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
  const { primarySymptoms } = useSelfScreenerContext()

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
  const { primarySymptoms, updateSymptoms } = useSelfScreenerContext()

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
  const { primarySymptoms, updateSymptoms } = useSelfScreenerContext()

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
      <Button onPress={updateSymptom} label="Update" />
    </View>
  )
}
