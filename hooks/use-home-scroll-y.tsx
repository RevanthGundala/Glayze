import { useRef } from "react";
import { Animated } from "react-native";

let homeScrollY: Animated.Value | null = null;

export function useHomeScrollY() {
  const scrollY = useRef(homeScrollY || new Animated.Value(0)).current;

  if (!homeScrollY) {
    homeScrollY = scrollY;
  }

  return scrollY;
}
