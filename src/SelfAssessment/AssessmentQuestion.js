import React, { useContext, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native"

import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"
import { AnswersContext } from "./Context"
import { AssessmentOption } from "./AssessmentOption"
import {
  QUESTION_TYPE_MULTI,
  SCREEN_TYPE_CHECKBOX,
  SCREEN_TYPE_DATE,
  SCREEN_TYPE_RADIO,
} from "./constants"

import { Colors, Spacing, Typography } from "../styles"

/**
 * @typedef { import(".").SurveyQuestion } SurveyQuestion
 * @typedef { import(".").SurveyOption } SurveyOption
 * @typedef { import(".").SurveyAnswers } SurveyAnswers
 */

/** @type {React.FunctionComponent<{
 *   onNext: () => void;
 *   onChange: (value: { index: number, value: string }[]) => void;
 *   option: SurveyOption
 *   question: SurveyQuestion
 * }>} */
export const AssessmentQuestion = ({ onNext, onChange, option, question }) => {
  const { t } = useTranslation()
  const answers = useContext(AnswersContext)
  const [selectedValues, setSelectedValues] = useState(
    answers[question.id] || [],
  )

  // Allow line breaks in the description
  const description = useMemo(() => {
    if (!question.question_description) return null
    const elements = []
    for (const line of question.question_description.split("\n")) {
      let l = line.trim()
      if (!l) continue
      elements.push(
        <GlobalText testID="description" key={l} style={style.description}>
          {l}
        </GlobalText>,
      )
    }
    return <View style={style.descriptionWrapper}>{elements}</View>
  }, [question.question_description])

  const displayAsOption = [
    SCREEN_TYPE_CHECKBOX,
    SCREEN_TYPE_RADIO,
    SCREEN_TYPE_DATE,
  ].includes(question.screen_type)

  const assessmentInputInstruction =
    question.question_type === QUESTION_TYPE_MULTI
      ? "Select all that apply"
      : "Select one"

  const options =
    displayAsOption &&
    option.values.map((option, index) => (
      <AssessmentOption
        answer={selectedValues.find((v) => v.index === index)}
        index={index}
        key={option.value}
        onSelect={(value) => onSelectHandler(value, index)}
        option={option}
        isSelected={selectedValues.some((v) => v.index === index)}
        optionType={question.screen_type}
      />
    ))

  /** @type {(value: string, index: number) => void} */
  const onSelectHandler = (value, index) => {
    if (question.question_type === QUESTION_TYPE_MULTI) {
      return setSelectedValues((values) => {
        // TODO: Better way to filter single value questions?
        const singleValueQuestions = [
          "Choose not to answer",
          "None of the above",
          "None",
        ]
        // this looks for an existing value inside the selected values array
        // which indicates user unselected the value
        const unselectedValue = values.some((v) => v.index === index)
        const currentValue = option.values[index]
        // this handles deselect for values in multi question type
        // that should act as a single value type questions
        // basically when any other selection is made this question gets unselected
        const unselectSingleValueQuestion = values.filter((v) => {
          return !singleValueQuestions.includes(option.values[v.index].label)
        })

        if (singleValueQuestions.includes(currentValue.label)) {
          // this logic handles single value questions in multi question type environment
          return unselectedValue
            ? unselectSingleValueQuestion
            : [{ index, value }]
        } else {
          // this logic handles the multi value questions selection
          return unselectedValue
            ? unselectSingleValueQuestion.filter((v) => v.index !== index)
            : [...unselectSingleValueQuestion, { index, value }]
        }
      })
    }
    return setSelectedValues([{ index, value }])
  }

  useEffect(() => {
    onChange(selectedValues)
  }, [selectedValues, onChange])

  return (
    <SafeAreaView style={style.container}>
      <ScrollView style={style.scrollView}>
        <View style={style.header}>
          <GlobalText style={style.headerContent}>
            {question.question_text}
          </GlobalText>
        </View>
        <View style={style.scrollViewContent}>
          {description}
          <GlobalText style={style.instruction}>
            {assessmentInputInstruction}
          </GlobalText>
          <View style={style.optionsWrapper}>{options}</View>
        </View>
      </ScrollView>
      <View style={style.footer}>
        <Button
          disabled={!selectedValues.length}
          onPress={onNext}
          label={t("assessment.next")}
          buttonStyle={style.button}
          textStyle={style.buttonText}
        />
      </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  header: {
    paddingHorizontal: Spacing.medium,
    marginTop: Spacing.small,
  },
  headerContent: {
    ...Typography.header2,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: Spacing.medium,
  },
  description: {
    fontFamily: Typography.baseFontFamily,
  },
  descriptionWrapper: {
    marginTop: Spacing.small,
  },
  optionsWrapper: {
    marginTop: Spacing.medium,
  },
  instruction: {
    ...Typography.mediumFont,
    lineHeight: Typography.smallerLineHeight,
    color: Colors.secondaryHeaderText,
    marginTop: Spacing.xLarge,
  },
  button: {
    backgroundColor: Colors.secondaryViolet,
  },
  buttonText: {
    color: Colors.white,
  },
  footer: {
    padding: Spacing.medium,
  },
})
