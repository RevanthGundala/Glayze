import React from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";

type ButtonProps = {
  buttonStyle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
};
export const Button = ({ buttonStyle, onPress, children }: ButtonProps) => {
  return (
    <Pressable className={buttonStyle} onPress={onPress}>
        {children}
    </Pressable>
  );
};
