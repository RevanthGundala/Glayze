import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { View, TextInput, TouchableWithoutFeedback } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/ThemeContext";

type InputProps = {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  readOnly?: boolean;
  search?: boolean;
};

export type InputHandle = {
  focus: () => void;
  blur: () => void;
};

export const Input = forwardRef<InputHandle, InputProps>(
  (
    { placeholder, value, onChangeText, onSubmitEditing, readOnly, search },
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

    const inputBackgroundColor =
      themeName === "dark"
        ? theme.backgroundColor
        : theme.secondaryBackgroundColor;

    const textColor = themeName === "dark" ? "#FFFFFF" : theme.textColor;

    return (
      <TouchableWithoutFeedback onPress={focusInput}>
        <View
          className="flex flex-row items-center rounded-lg border border-gray-300"
          style={{ backgroundColor: inputBackgroundColor }}
        >
          {search && (
            <Image
              source={require("@/assets/images/tabs/search.png")}
              className="w-5 h-5 ml-4"
              style={{ opacity: 0.5, tintColor: theme.mutedForegroundColor }}
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
              color: textColor,
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
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
);
