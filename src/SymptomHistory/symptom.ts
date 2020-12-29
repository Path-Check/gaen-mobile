import { TFunction } from "i18next"

export type Symptom =
  | "trouble_breathing"
  | "persistent_pain_or_pressure_in_the_chest"
  | "new_confusion"
  | "inability_to_wake_or_stay_awake"
  | "bluish_lips_or_face"
  | "fever_or_chills"
  | "cough"
  | "fatigue"
  | "muscle_or_body_aches"
  | "headache"
  | "new_loss_of_taste_or_smell"
  | "sore_throat"
  | "congestion_or_runny_nose"
  | "nausea_or_vomiting"
  | "diarrhea"
  | "other"

export const all: Symptom[] = [
  "trouble_breathing",
  "persistent_pain_or_pressure_in_the_chest",
  "new_confusion",
  "inability_to_wake_or_stay_awake",
  "bluish_lips_or_face",
  "fever_or_chills",
  "cough",
  "fatigue",
  "muscle_or_body_aches",
  "headache",
  "new_loss_of_taste_or_smell",
  "sore_throat",
  "congestion_or_runny_nose",
  "nausea_or_vomiting",
  "diarrhea",
  "other",
]

export const covidSymptoms: Symptom[] = [
  "fever_or_chills",
  "cough",
  "fatigue",
  "muscle_or_body_aches",
  "headache",
  "new_loss_of_taste_or_smell",
  "sore_throat",
  "congestion_or_runny_nose",
  "nausea_or_vomiting",
  "diarrhea",
]

export const emergencySymptoms: Symptom[] = [
  "trouble_breathing",
  "persistent_pain_or_pressure_in_the_chest",
  "new_confusion",
  "inability_to_wake_or_stay_awake",
  "bluish_lips_or_face",
]

export const fromString = (rawSymptom: string): Symptom | null => {
  switch (rawSymptom) {
    case "trouble_breathing": {
      return "trouble_breathing"
    }
    case "persistent_pain_or_pressure_in_the_chest": {
      return "persistent_pain_or_pressure_in_the_chest"
    }
    case "new_confusion": {
      return "new_confusion"
    }
    case "inability_to_wake_or_stay_awake": {
      return "inability_to_wake_or_stay_awake"
    }
    case "bluish_lips_or_face": {
      return "bluish_lips_or_face"
    }
    case "fever_or_chills": {
      return "fever_or_chills"
    }
    case "cough": {
      return "cough"
    }
    case "fatigue": {
      return "fatigue"
    }
    case "muscle_or_body_aches": {
      return "muscle_or_body_aches"
    }
    case "headache": {
      return "headache"
    }
    case "new_loss_of_taste_or_smell": {
      return "new_loss_of_taste_or_smell"
    }
    case "sore_throat": {
      return "sore_throat"
    }
    case "congestion_or_runny_nose": {
      return "congestion_or_runny_nose"
    }
    case "nausea_or_vomiting": {
      return "nausea_or_vomiting"
    }
    case "diarrhea": {
      return "diarrhea"
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
    case "trouble_breathing": {
      return "trouble_breathing"
    }
    case "persistent_pain_or_pressure_in_the_chest": {
      return "persistent_pain_or_pressure_in_the_chest"
    }
    case "new_confusion": {
      return "new_confusion"
    }
    case "inability_to_wake_or_stay_awake": {
      return "inability_to_wake_or_stay_awake"
    }
    case "bluish_lips_or_face": {
      return "bluish_lips_or_face"
    }
    case "fever_or_chills": {
      return "fever_or_chills"
    }
    case "cough": {
      return "cough"
    }
    case "fatigue": {
      return "fatigue"
    }
    case "muscle_or_body_aches": {
      return "muscle_or_body_aches"
    }
    case "headache": {
      return "headache"
    }
    case "new_loss_of_taste_or_smell": {
      return "new_loss_of_taste_or_smell"
    }
    case "sore_throat": {
      return "sore_throat"
    }
    case "congestion_or_runny_nose": {
      return "congestion_or_runny_nose"
    }
    case "nausea_or_vomiting": {
      return "nausea_or_vomiting"
    }
    case "diarrhea": {
      return "diarrhea"
    }
    case "other": {
      return "other"
    }
  }
}

export const toTranslation = (t: TFunction, symptom: Symptom): string => {
  switch (symptom) {
    case "trouble_breathing": {
      return t("symptom.shortness_of_breath_or_difficulty_breathing")
    }
    case "persistent_pain_or_pressure_in_the_chest": {
      return t("symptom.persistent_pain_or_pressure_in_the_chest")
    }
    case "new_confusion": {
      return t("symptom.new_confusion")
    }
    case "inability_to_wake_or_stay_awake": {
      return t("symptom.inability_to_wake_or_stay_awake")
    }
    case "bluish_lips_or_face": {
      return t("symptom.bluish_lips_or_face")
    }
    case "fever_or_chills": {
      return t("symptom.fever_or_chills")
    }
    case "cough": {
      return t("symptom.cough")
    }
    case "fatigue": {
      return t("symptom.fatigue")
    }
    case "muscle_or_body_aches": {
      return t("symptom.muscle_or_body_aches")
    }
    case "headache": {
      return t("symptom.headache")
    }
    case "new_loss_of_taste_or_smell": {
      return t("symptom.new_loss_of_taste_or_smell")
    }
    case "sore_throat": {
      return t("symptom.sore_throat")
    }
    case "congestion_or_runny_nose": {
      return t("symptom.congestion_or_runny_nose")
    }
    case "nausea_or_vomiting": {
      return t("symptom.nausea_or_vomiting")
    }
    case "diarrhea": {
      return t("symptom.diarrhea")
    }
    case "other": {
      return t("symptom.other")
    }
  }
}
