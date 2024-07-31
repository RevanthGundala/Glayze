import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

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
  return (
    <View className="flex-row justify-around py-4 border-b-2 border-neutral">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setSelectedTab(tab)}
          className={`px-4 py-2 rounded-full ${
            selectedTab === tab ? "bg-primary" : "bg-neutral"
          }`}
        >
          <Text
            className={`${
              selectedTab === tab ? "text-black" : "text-gray-300"
            }`}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
