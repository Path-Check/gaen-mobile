import React, {
  FunctionComponent,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react"
import { Easing, Animated, AccessibilityInfo } from "react-native"

import { Outlines, Colors } from "../../styles"

interface AnimatedCircleProps {
  iconSize: number
}

const AnimatedCircle: FunctionComponent<AnimatedCircleProps> = ({
  iconSize,
}) => {
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState<boolean>(
    false,
  )

  const animationTime = 1600
  const delayTime = 2000
  const initialCircleSize = 0
  const endingCircleSize = 600
  const initialTopValue = iconSize / 2
  const endingTopValue = endingCircleSize * -0.46
  const initialOpacity = 0.2
  const endingOpacity = 0.0

  const sizeAnimatedValue = useRef(new Animated.Value(initialCircleSize))
    .current
  const topAnimatedValue = useRef(new Animated.Value(initialTopValue)).current
  const opacityAnimatedValue = useRef(new Animated.Value(initialOpacity))
    .current

  const playAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(sizeAnimatedValue, {
            toValue: endingCircleSize,
            duration: animationTime,
            easing: Easing.quad,
            useNativeDriver: false,
          }),
          Animated.timing(topAnimatedValue, {
            toValue: endingTopValue,
            duration: animationTime,
            easing: Easing.quad,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnimatedValue, {
            toValue: endingOpacity,
            duration: animationTime,
            easing: Easing.quad,
            useNativeDriver: false,
          }),
          Animated.delay(delayTime),
        ]),
      ]),
    ).start()
  }, [
    endingTopValue,
    opacityAnimatedValue,
    sizeAnimatedValue,
    topAnimatedValue,
  ])

  useEffect(playAnimation, [playAnimation])

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()?.then((result) => {
      setIsReduceMotionEnabled(result)
    })
  }, [])

  return !isReduceMotionEnabled ? (
    <Animated.View
      style={{
        position: "absolute",
        top: topAnimatedValue,
        alignSelf: "center",
        width: sizeAnimatedValue,
        height: sizeAnimatedValue,
        borderColor: Colors.accent.success100,
        borderWidth: Outlines.hairline,
        borderRadius: Outlines.borderRadiusMax,
        opacity: opacityAnimatedValue,
      }}
    />
  ) : null
}

export default AnimatedCircle
