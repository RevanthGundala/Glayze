import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { View, TextInput, TouchableWithoutFeedback } from "react-native";
import { Image } from "expo-image";

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

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));

    const focusInput = () => {
      inputRef.current?.focus();
    };

    return (
      <TouchableWithoutFeedback onPress={focusInput}>
        <View className="flex flex-row items-center bg-neutral text-white rounded-lg">
          {search && (
            <Image
              source={require("@/assets/images/tabs/search.png")}
              className="w-5 h-5 opacity-50 ml-4"
            />
          )}
          <TextInput
            ref={(el) => {
              inputRef.current = el;
            }}
            className={
              search
                ? "flex-1 text-lg bg-neutral text-white p-4 rounded-lg"
                : "flex-1 bg-neutral text-white p-4 rounded-lg"
            }
            placeholder={placeholder}
            placeholderTextColor="#6B7280"
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            editable={!readOnly}
            selectTextOnFocus={!readOnly}
            selectionColor="white"
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
);
