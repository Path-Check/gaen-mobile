export type Symptom =
  | "chest_pain_or_pressure"
  | "difficulty_breathing"
  | "lightheadedness"
  | "disorientation_or_unresponsiveness"
  | "fever"
  | "chills"
  | "cough"
  | "loss_of_smell"
  | "loss_of_taste"
  | "loss_of_appetite"
  | "vomiting"
  | "diarrhea"
  | "body_aches"
  | "other"

export const all: Symptom[] = [
  "chest_pain_or_pressure",
  "difficulty_breathing",
  "lightheadedness",
  "disorientation_or_unresponsiveness",
  "fever",
  "chills",
  "cough",
  "loss_of_smell",
  "loss_of_taste",
  "loss_of_appetite",
  "vomiting",
  "diarrhea",
  "body_aches",
  "other",
]

export const fromString = (rawSymptom: string): Symptom | null => {
  switch (rawSymptom) {
    case "chest_pain_or_pressure": {
      return "chest_pain_or_pressure"
    }
    case "difficulty_breathing": {
      return "difficulty_breathing"
    }
    case "lightheadedness": {
      return "lightheadedness"
    }
    case "disorientation_or_unresponsiveness": {
      return "disorientation_or_unresponsiveness"
    }
    case "fever": {
      return "fever"
    }
    case "chills": {
      return "chills"
    }
    case "cough": {
      return "cough"
    }
    case "loss_of_smell": {
      return "loss_of_smell"
    }
    case "loss_of_taste": {
      return "loss_of_taste"
    }
    case "loss_of_appetite": {
      return "loss_of_appetite"
    }
    case "vomiting": {
      return "vomiting"
    }
    case "diarrhea": {
      return "diarrhea"
    }
    case "body_aches": {
      return "body_aches"
    }
    default: {
      return null
    }
  }
}

export const toString = (symptom: Symptom): string => {
  switch (symptom) {
    case "chest_pain_or_pressure": {
      return "chest_pain_or_pressure"
    }
    case "difficulty_breathing": {
      return "difficulty_breathing"
    }
    case "lightheadedness": {
      return "lightheadedness"
    }
    case "disorientation_or_unresponsiveness": {
      return "disorientation_or_unresponsiveness"
    }
    case "fever": {
      return "fever"
    }
    case "chills": {
      return "chills"
    }
    case "cough": {
      return "cough"
    }
    case "loss_of_smell": {
      return "loss_of_smell"
    }
    case "loss_of_taste": {
      return "loss_of_taste"
    }
    case "loss_of_appetite": {
      return "loss_of_appetite"
    }
    case "vomiting": {
      return "vomiting"
    }
    case "diarrhea": {
      return "diarrhea"
    }
    case "body_aches": {
      return "body_aches"
    }
  }
}

export const toTranslationKey = (symptom: Symptom): string => {
  `symptoms.${toString(symptom)}`
}
