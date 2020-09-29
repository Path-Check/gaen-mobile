import React, { FunctionComponent } from "react"
import { TouchableOpacity } from "react-native"
import { SvgXml } from "react-native-svg"
import { Icons } from "../assets"
import { GlobalText } from "../components"
import { Colors, Iconography } from "../styles"

interface SymptomCheckboxProps {
  label: string
  onPress: () => void
  checked: boolean
}

const SymptomCheckbox: FunctionComponent<SymptomCheckboxProps> = ({
  label,
  onPress,
  checked,
}) => {
  const checkboxIcon = checked ? Icons.CheckboxChecked : Icons.CheckboxUnchecked
  return (
    <TouchableOpacity onPress={onPress} accessible accessibilityLabel={label}>
      <SvgXml
        xml={checkboxIcon}
        fill={Colors.primary125}
        width={Iconography.small}
        height={Iconography.small}
      />
      <GlobalText>{label}</GlobalText>
    </TouchableOpacity>
  )
}

export default SymptomCheckbox
