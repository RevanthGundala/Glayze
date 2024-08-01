import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "@/components/header";

export default function Appearance() {
  const { theme, setTheme, themeName } = useTheme();

  const themeOptions = [
    { name: "Light", value: "light" },
    { name: "Dark", value: "dark" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <View className="px-8 pt-4 space-y-4">
        <Text style={{ color: theme.textColor }} className="text-2xl font-bold">
          Appearance
        </Text>
        <Text
          style={{ color: theme.mutedForegroundColor }}
          className="text-base"
        >
          Choose how Glayze looks to you. Select a single theme.
        </Text>
        <View className="space-y-2">
          {themeOptions.map((option) => (
            <ThemeOption
              key={option.value}
              name={option.name}
              value={option.value}
              isSelected={themeName === option.value}
              onSelect={() => setTheme(option.value)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const ThemeOption = ({ name, value, isSelected, onSelect }) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onSelect}
      className="flex-row justify-between items-center w-full py-4 border-b border-gray-700"
    >
      <View className="flex-row items-center space-x-4">
        {/* <Image
          source={
            value === "light"
              ? require("@/assets/images/light-mode-icon.png")
              : require("@/assets/images/dark-mode-icon.png")
          }
          className="w-6 h-6"
        /> */}
        <Text style={{ color: theme.textColor }} className="text-lg">
          {name}
        </Text>
      </View>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: theme.textColor,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isSelected && (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: theme.textColor,
            }}
          />
        )}
      </View>
    </Pressable>
  );
};
