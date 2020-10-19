import { TFunction } from "i18next"

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
  "cough",
  "fever",
  "chest_pain_or_pressure",
  "difficulty_breathing",
  "lightheadedness",
  "disorientation_or_unresponsiveness",
  "chills",
  "loss_of_smell",
  "loss_of_taste",
  "loss_of_appetite",
  "vomiting",
  "diarrhea",
  "body_aches",
  "other",
]

export const emergencySymptoms: Symptom[] = [
  "chest_pain_or_pressure",
  "difficulty_breathing",
  "lightheadedness",
  "disorientation_or_unresponsiveness",
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
    case "other": {
      return "other"
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
    case "other": {
      return "other"
    }
  }
}

export const toTranslation = (t: TFunction, symptom: Symptom): string => {
  switch (symptom) {
    case "chest_pain_or_pressure": {
      return t("symptoms.chest_pain_or_pressure")
    }
    case "difficulty_breathing": {
      return t("symptoms.difficulty_breathing")
    }
    case "lightheadedness": {
      return t("symptoms.lightheadedness")
    }
    case "disorientation_or_unresponsiveness": {
      return t("symptoms.disorientation_or_unresponsiveness")
    }
    case "fever": {
      return t("symptoms.fever")
    }
    case "chills": {
      return t("symptoms.chills")
    }
    case "cough": {
      return t("symptoms.cough")
    }
    case "loss_of_smell": {
      return t("symptoms.loss_of_smell")
    }
    case "loss_of_taste": {
      return t("symptoms.loss_of_taste")
    }
    case "loss_of_appetite": {
      return t("symptoms.loss_of_appetite")
    }
    case "vomiting": {
      return t("symptoms.vomiting")
    }
    case "diarrhea": {
      return t("symptoms.diarrhea")
    }
    case "body_aches": {
      return t("symptoms.body_aches")
    }
    case "other": {
      return t("symptoms.other")
    }
  }
}
