import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

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

  return (
    <View
      className={`flex-row justify-around py-4 border-b-2`}
      style={{
        borderColor: theme.borderColor,
        backgroundColor: theme.backgroundColor,
      }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setSelectedTab(tab)}
          className={`px-4 py-2 rounded-full`}
          style={{
            backgroundColor:
              selectedTab === tab
                ? theme.tintColor
                : theme.secondaryBackgroundColor,
          }}
        >
          <Text
            style={{
              color:
                selectedTab === tab
                  ? theme.tintTextColor
                  : theme.mutedForegroundColor,
            }}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
