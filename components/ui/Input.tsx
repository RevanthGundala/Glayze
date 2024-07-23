import React from "react";
import { View, TextInput } from "react-native";
import { Image } from "expo-image";

type InputProps = {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  readOnly?: true;
  search?: true;
};
export const Input = ({
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  readOnly,
  search,
}: InputProps) => {
  return (
    <View className="flex flex-row items-center bg-neutral text-white rounded-lg">
      {search && (
        <Image
          source={require("@/assets/images/tabs/search.png")}
          className="w-5 h-5 opacity-50 ml-4"
        />
      )}
      <TextInput
        className={
          search
            ? "text-lg bg-neutral text-white p-4 rounded-lg"
            : "bg-neutral text-white p-4 rounded-lg"
        }
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        readOnly={readOnly}
        autoFocus={true}
        selectionColor="white"
      />
    </View>
  );
};
