import React from "react";
import { TouchableOpacity, StyleProp } from "react-native";

type ButtonProps = {
  buttonStyle?: string;
  style?: StyleProp<any>;
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
    <TouchableOpacity
      className={buttonStyle}
      style={style ?? {}}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};
