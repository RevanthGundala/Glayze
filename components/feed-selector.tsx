import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/utils/theme";

type FeedSelectorProps = {
  tabs: string[];
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
};

export const FeedSelector = ({
  tabs,
  selectedTab,
  setSelectedTab,
}: FeedSelectorProps) => {
  const { theme } = useTheme();

  const getBackgroundColor = (isSelected: boolean) => {
    return isSelected
      ? theme.tabBarActiveTintColor
      : theme.tabBarInactiveTintColor;
  };

  return (
    <View
      className={`flex-row justify-around py-4 border-b-2`}
      style={{
        borderColor: theme.borderColor,
        backgroundColor: theme.backgroundColor,
      }}
    >
      {tabs.map((tab) => {
        const isSelected = selectedTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-full`}
            style={{
              backgroundColor: getBackgroundColor(isSelected),
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontWeight: "bold",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
