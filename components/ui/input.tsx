import React, { forwardRef, useRef, useImperativeHandle } from "react";
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  StyleProp,
  TextStyle,
  TextInputProps,
} from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/theme-context";

type InputProps = {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  readOnly?: boolean;
  search?: boolean;
  className?: string; // Add this line for custom classes
  style?: StyleProp<TextStyle>;
  keyboardType?: TextInputProps["keyboardType"];
};

export type InputHandle = {
  focus: () => void;
  blur: () => void;
};

export const Input = forwardRef<InputHandle, InputProps>(
  (
    {
      placeholder,
      value,
      onChangeText,
      onSubmitEditing,
      readOnly,
      search,
      className,
      keyboardType,
    },
    ref
  ) => {
    const inputRef = useRef<TextInput | null>(null);
    const { theme, themeName } = useTheme();

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));

    const focusInput = () => {
      inputRef.current?.focus();
    };

    return (
      <TouchableWithoutFeedback onPress={focusInput}>
        <View
          className={`flex flex-row items-center rounded-lg border ${className}`}
          style={{
            backgroundColor: theme.backgroundColor,
            borderColor: theme.mutedForegroundColor,
          }}
        >
          {search && (
            <Image
              source={require("@/assets/images/tabs/search.png")}
              className="w-5 h-5 ml-4 mt-1"
              style={{ opacity: 0.5, tintColor: theme.textColor }}
            />
          )}
          <TextInput
            ref={(el) => {
              inputRef.current = el;
            }}
            className={
              search ? "flex-1 text-lg p-4 rounded-lg" : "flex-1 p-4 rounded-lg"
            }
            style={{
              color: theme.textColor,
              backgroundColor: "transparent",
            }}
            placeholder={placeholder}
            placeholderTextColor={theme.mutedForegroundColor}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            editable={!readOnly}
            selectTextOnFocus={!readOnly}
            selectionColor={theme.textColor}
            keyboardType={keyboardType}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
);
