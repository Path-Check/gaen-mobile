import { TFunction } from "i18next"

import { posixToDayjs } from "../../utils/dateTime"
import { DATE_FORMAT } from "../SymptomEntryListItem"
import { SymptomHistory, SymptomEntry } from "../symptomHistory"
import * as Symptom from "../symptom"

class SymptomHistoryFormatter {
  private DATE_FORMAT = DATE_FORMAT
  private t: TFunction
  private symptomHistory: SymptomHistory

  public static forSharing = (
    t: TFunction,
    symptomHistory: SymptomHistory,
  ): string => {
    const formatter = new SymptomHistoryFormatter(t, symptomHistory)
    return formatter.toShareableText()
  }

  private constructor(t: TFunction, symptomHistory: SymptomHistory) {
    this.t = t
    this.symptomHistory = symptomHistory
  }

  private toShareableText = (): string => {
    const {
      symptomHistory,
      sharedHistoryHeader,
      toFormattedSymptomEntry,
    } = this
    const NEW_EMPTY_LINE = "\n\n"

    const header = sharedHistoryHeader()

    const allEntriesFormatted = symptomHistory.map(toFormattedSymptomEntry)

    return [header, ...allEntriesFormatted].join(NEW_EMPTY_LINE)
  }

  private sharedHistoryHeader = (): string => {
    const { t, symptomHistory, DATE_FORMAT } = this
    const fromEntry = symptomHistory[0]
    const toEntry = symptomHistory[symptomHistory.length - 1]

    const firstEntryDayJSDate = posixToDayjs(fromEntry.date)
    const lastEntryDayJSDate = posixToDayjs(toEntry.date)

    const startDate = firstEntryDayJSDate?.local().format(DATE_FORMAT) || ""
    const endDate = lastEntryDayJSDate?.local().format(DATE_FORMAT) || ""

    return t("symptom_history.sharing.header", { startDate, endDate })
  }

  private toFormattedSymptomEntry = (symptomEntry: SymptomEntry): string => {
    const { symptomEntryDetails, DATE_FORMAT } = this
    const NEW_LINE = "\n"

    const date = symptomEntry.date
    const entryDateDayJs = posixToDayjs(date)

    const entryDate = entryDateDayJs?.local().format(DATE_FORMAT) || ""
    const entryDetails = symptomEntryDetails(symptomEntry)

    return [entryDate, entryDetails].join(NEW_LINE)
  }

  private symptomEntryDetails = (symptomEntry: SymptomEntry): string => {
    const { t, translatedSymptoms } = this
    let details = ""

    if (symptomEntry.kind === "NoUserInput") {
      details = t("symptom_history.sharing.no_symptoms_were_logged")
    } else {
      if (symptomEntry.symptoms.size > 0) {
        details = t("symptom_history.sharing.you_did_not_feel_well", {
          symptomList: translatedSymptoms([...symptomEntry.symptoms]),
        })
      } else {
        details = t("symptom_history.sharing.you_felt_well")
      }
    }

    return details
  }

  private translatedSymptoms = (symptoms: Symptom.Symptom[]): string => {
    const { t } = this

    return symptoms
      .map((symptom: Symptom.Symptom) => Symptom.toTranslation(t, symptom))
      .join(", ")
  }
}

export default SymptomHistoryFormatter
