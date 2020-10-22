import React, { FunctionComponent } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { SymptomHistoryStackParams } from "../navigation/SymptomHistoryStack"
import { SymptomHistoryStackScreens } from "../navigation"
import { Text } from "../components"
import { posixToDayjs } from "../utils/dateTime"
import * as Symptom from "./symptom"
import { SymptomEntry } from "./symptomHistory"

import { Icons } from "../assets"
import {
  Affordances,
  Typography,
  Colors,
  Outlines,
  Spacing,
  Iconography,
  Layout,
} from "../styles"

type SymptomEntryListItemProps = {
  entry: SymptomEntry
}

const SymptomEntryListItem: FunctionComponent<SymptomEntryListItemProps> = ({
  entry,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation<
    StackNavigationProp<SymptomHistoryStackParams>
  >()

  const dayJsDate = posixToDayjs(entry.date)

  if (!dayJsDate) {
    return null
  }

  const handleOnPressEdit = () => {
    navigation.navigate(SymptomHistoryStackScreens.SelectSymptoms, {
      symptomEntry: entry,
    })
  }

  const dateText = dayJsDate.local().format("MMM D, 'YY")

  const toSymptomText = (symptom: Symptom.Symptom) => {
    const translatedSymptom = Symptom.toTranslation(t, symptom)
    return (
      <Text style={style.symptomText} key={translatedSymptom}>
        {`• ${translatedSymptom}`}
      </Text>
    )
  }

  interface CardConfig {
    headerContent: string
    symptoms: Set<Symptom.Symptom> | null
    circleColor: string
  }

  const determineCardConfig = (entry: SymptomEntry): CardConfig => {
    switch (entry.kind) {
      case "NoUserInput": {
        return {
          headerContent: t("symptom_history.no_entry"),
          symptoms: null,
          circleColor: Colors.white,
        }
      }
      case "UserInput": {
        if (entry.symptoms.size > 0) {
          return {
            headerContent: t("symptom_history.did_not_feel_well"),
            symptoms: entry.symptoms,
            circleColor: Colors.danger25,
          }
        } else {
          return {
            headerContent: t("symptom_history.felt_well"),
            symptoms: null,
            circleColor: Colors.success25,
          }
        }
      }
    }
  }

  const { headerContent, symptoms, circleColor } = determineCardConfig(entry)

  return (
    <TouchableOpacity
      onPress={handleOnPressEdit}
      accessibilityLabel={`${t("common.edit")} - ${dateText}`}
      style={style.outerContainer}
    >
      <View style={style.container}>
        <View style={style.chevronRightIcon}>
          <SvgXml
            xml={Icons.ChevronRight}
            width={Iconography.xxSmall}
            height={Iconography.xxSmall}
            fill={Colors.neutral50}
          />
        </View>
        <View style={style.contentContainer}>
          <Text style={style.headerText}>{headerContent}</Text>
          {symptoms && (
            <View style={style.symptomsContainer}>
              {[...symptoms].map(toSymptomText)}
            </View>
          )}
          <View style={style.dateTextContainer}>
            <Text style={style.dateText}>{dateText}</Text>
          </View>
        </View>
        <View style={{ ...style.circle, backgroundColor: circleColor }} />
      </View>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  outerContainer: {
    ...Outlines.lightShadow,
  },
  container: {
    ...Affordances.floatingContainer,
    marginBottom: Spacing.xLarge,
    overflow: "hidden",
  },
  contentContainer: {
    zIndex: Layout.zLevel1,
  },
  chevronRightIcon: {
    position: "absolute",
    top: Spacing.large,
    right: Spacing.large,
    zIndex: Layout.zLevel1,
  },
  headerText: {
    ...Typography.header3,
    paddingRight: Spacing.xLarge,
  },
  symptomsContainer: {
    flexDirection: "column",
    marginTop: Spacing.small,
  },
  symptomText: {
    ...Typography.body1,
    marginBottom: Spacing.xxxSmall,
  },
  dateTextContainer: {
    borderTopWidth: Outlines.hairline,
    borderColor: Colors.neutral30,
    marginTop: Spacing.small,
  },
  dateText: {
    ...Typography.monospace,
    color: Colors.neutral100,
    paddingTop: Spacing.xxSmall,
  },
  circle: {
    width: 150,
    height: 150,
    position: "absolute",
    bottom: -80,
    right: -80,
    borderRadius: Outlines.borderRadiusMax,
  },
})

export default SymptomEntryListItem
