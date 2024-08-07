import React from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleProp,
} from "react-native";

type ButtonProps = {
  buttonStyle?: string;
  style: StyleProp<any>;
  onPress?: () => void;
  children?: React.ReactNode;
};
export const Button = ({
  buttonStyle,
  style,
  onPress,
  children,
}: ButtonProps) => {
  return (
    <Pressable className={buttonStyle} style={style} onPress={onPress}>
      {children}
    </Pressable>
  );
};
