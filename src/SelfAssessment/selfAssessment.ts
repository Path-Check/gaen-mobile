export enum EmergencySymptom {
  CHEST_PAIN = "CHEST_PAIN",
  SEVERE_DIFFICULTY_BREATHING = "SEVERE_DIFFICULTY_BREATHING",
  LIGHTHEADEDNESS = "LIGHTHEADEDNESS",
  DISORIENTATION = "DISORIENTATION",
}

export enum PrimarySymptom {
  FEVER_OR_CHILLS = "FEVER_OR_CHILLS",
  COUGH = "COUGH",
  MODERATE_DIFFICULTY_BREATHING = "MODERATE_DIFFICULTY_BREATHING",
}

export enum SecondarySymptom {
  ACHING = "ACHING",
  LOSS_OF_SMELL_TASTE_APPETITE = "LOSS_OF_SMELL_TASTE_APPETITE",
}
export enum OtherSymptom {
  VOMITING_OR_DIARRHEA = "VOMITING_OR_DIARRHEA",
  OTHER = "OTHER",
}

export type GeneralSymptom =
  | EmergencySymptom
  | PrimarySymptom
  | SecondarySymptom
  | OtherSymptom

export enum UnderlyingCondition {
  LUNG_DISEASE,
  HEART_CONDITION,
  WEAKENED_IMMUNE_SYSTEM,
  OBESITY,
  KIDNEY_DISEASE,
  DIABETES,
  LIVER_DISEASE,
  HIGH_BLOOD_PRESSURE,
  BLOOD_DISORDER,
  CEREBROVASCULAR_DISEASE,
  SMOKING,
  PREGNANCY,
}

export enum AgeRange {
  EIGHTEEN_TO_SIXTY_FOUR,
  SIXTY_FIVE_AND_OVER,
}

export enum SymptomGroup {
  EMERGENCY,
  PRIMARY_1,
  PRIMARY_2,
  PRIMARY_3,
  SECONDARY_1,
  SECONDARY_2,
  NON_COVID,
  ASYMPTOMATIC,
}

export type SelfAssessmentAnswers = {
  emergencySymptoms: EmergencySymptom[]
  primarySymptoms: PrimarySymptom[]
  secondarySymptoms: SecondarySymptom[]
  otherSymptoms: OtherSymptom[]
  underlyingConditions: UnderlyingCondition[]
  ageRange: AgeRange | null
}

export const determineSymptomGroup = (
  answers: SelfAssessmentAnswers,
): SymptomGroup => {
  if (isEmergencySymptomGroup(answers)) {
    return SymptomGroup.EMERGENCY
  } else if (isPrimarySymptomGroup1(answers)) {
    return SymptomGroup.PRIMARY_1
  } else if (isPrimarySymptomGroup2(answers)) {
    return SymptomGroup.PRIMARY_2
  } else if (isPrimarySymptomGroup3(answers)) {
    return SymptomGroup.PRIMARY_3
  } else if (isSecondarySymptomGroup1(answers)) {
    return SymptomGroup.SECONDARY_1
  } else if (isSecondarySymptomGroup2(answers)) {
    return SymptomGroup.SECONDARY_2
  } else if (isNonCovidSymptomGroup(answers)) {
    return SymptomGroup.NON_COVID
  } else if (isAsymptomaticGroup(answers)) {
    return SymptomGroup.ASYMPTOMATIC
  } else {
    return SymptomGroup.ASYMPTOMATIC
  }
}

const isEmergencySymptomGroup = (answers: SelfAssessmentAnswers): boolean => {
  return hasEmergencySymptom(answers.emergencySymptoms)
}

const isPrimarySymptomGroup1 = (answers: SelfAssessmentAnswers) => {
  return (
    hasPrimarySymptom(answers.primarySymptoms) &&
    hasUnderlyingCondition(answers.underlyingConditions)
  )
}

const isPrimarySymptomGroup2 = (answers: SelfAssessmentAnswers) => {
  return (
    hasPrimarySymptom(answers.primarySymptoms) &&
    isOver65(answers.ageRange) &&
    !hasUnderlyingCondition(answers.underlyingConditions)
  )
}

const isPrimarySymptomGroup3 = (answers: SelfAssessmentAnswers) => {
  return (
    hasPrimarySymptom(answers.primarySymptoms) &&
    isUnder65(answers.ageRange) &&
    !hasUnderlyingCondition(answers.underlyingConditions)
  )
}

const isSecondarySymptomGroup1 = (answers: SelfAssessmentAnswers) => {
  const isUnder65WithUnderlyingConditions =
    isUnder65(answers.ageRange) &&
    hasUnderlyingCondition(answers.underlyingConditions)
  return (
    !hasPrimarySymptom(answers.primarySymptoms) &&
    hasSecondarySymptoms(answers.secondarySymptoms) &&
    (isUnder65WithUnderlyingConditions || isOver65(answers.ageRange))
  )
}

const isSecondarySymptomGroup2 = (answers: SelfAssessmentAnswers) => {
  return (
    !hasPrimarySymptom(answers.primarySymptoms) &&
    hasSecondarySymptoms(answers.secondarySymptoms) &&
    isUnder65(answers.ageRange) &&
    !hasUnderlyingCondition(answers.underlyingConditions)
  )
}

const isNonCovidSymptomGroup = (answers: SelfAssessmentAnswers) => {
  return (
    !hasPrimarySymptom(answers.primarySymptoms) &&
    !hasSecondarySymptoms(answers.secondarySymptoms) &&
    hasNonCovidSymptoms(answers.otherSymptoms)
  )
}

const isAsymptomaticGroup = (answers: SelfAssessmentAnswers) => {
  return hasNoSymptoms(answers)
}

const hasEmergencySymptom = (
  emergencySymptoms: EmergencySymptom[],
): boolean => {
  return emergencySymptoms.length > 0
}

const hasPrimarySymptom = (primarySymptoms: PrimarySymptom[]): boolean => {
  return primarySymptoms.length > 0
}

const hasUnderlyingCondition = (
  underlyingConditions: UnderlyingCondition[],
): boolean => {
  return underlyingConditions.length > 0
}

const isOver65 = (ageRange: AgeRange | null): boolean => {
  return ageRange === AgeRange.SIXTY_FIVE_AND_OVER
}

const isUnder65 = (ageRange: AgeRange | null): boolean => {
  return ageRange === null || ageRange === AgeRange.EIGHTEEN_TO_SIXTY_FOUR
}

const hasSecondarySymptoms = (
  secondarySymptoms: SecondarySymptom[],
): boolean => {
  return secondarySymptoms.length > 0
}

const hasNonCovidSymptoms = (otherSymptoms: OtherSymptom[]): boolean => {
  return otherSymptoms.length > 0
}

const hasNoSymptoms = (answers: SelfAssessmentAnswers): boolean => {
  const { primarySymptoms, secondarySymptoms, otherSymptoms } = answers
  return (
    primarySymptoms.length === 0 &&
    secondarySymptoms.length === 0 &&
    otherSymptoms.length === 0
  )
}
