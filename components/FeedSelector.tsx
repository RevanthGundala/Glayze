import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Item } from "@/utils/types";

type FeedSelectorProps = {
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

export const FeedSelector = ({ setItems }: FeedSelectorProps) => {
  const [selectedTab, setSelectedTab] = useState("Trending");
  const tabs = ["Trending", "New", "Top"];

  // TODO: Replace with actual data
  useEffect(() => {
    setItems([
      {
        id: 1,
        user: {
          name: "John Doe",
          handle: "@johndoe",
          avatar: "https://via.placeholder.com/40",
        },
        price: 0.00034,
        change1h: 11,
        change24h: 36,
        tokenName: "Bronny James",
        ticker: "BRNY",
      },
      {
        id: 2,
        user: {
          name: "Jane Smith",
          handle: "@janesmith",
          avatar: "https://via.placeholder.com/40",
        },
        price: 0.00028,
        change1h: -5,
        change24h: 12,
        tokenName: "Stephen Curry",
        ticker: "CURR",
      },
      {
        id: 3,
        user: {
          name: "Bob Johnson",
          handle: "@bobjohnson",
          avatar: "https://via.placeholder.com/40",
        },
        price: 0.00041,
        change1h: 8,
        change24h: -3,
        tokenName: "LA Lakers",
        ticker: "LKRS",
      },
      {
        id: 3,
        user: {
          name: "Bob Johnson",
          handle: "@bobjohnson",
          avatar: "https://via.placeholder.com/40",
        },
        price: 0.00041,
        change1h: 8,
        change24h: -3,
        tokenName: "LA Lakers",
        ticker: "LKRS",
      },
      {
        id: 3,
        user: {
          name: "Bob Johnson",
          handle: "@bobjohnson",
          avatar: "https://via.placeholder.com/40",
        },
        price: 0.00041,
        change1h: 8,
        change24h: -3,
        tokenName: "LA Lakers",
        ticker: "LKRS",
      },
      {
        id: 3,
        user: {
          name: "Bob Johnson",
          handle: "@bobjohnson",
          avatar: "https://via.placeholder.com/40",
        },
        price: 0.00041,
        change1h: 8,
        change24h: -3,
        tokenName: "LA Lakers",
        ticker: "LKRS",
      },
      {
        id: 3,
        user: {
          name: "Bob Johnson",
          handle: "@bobjohnson",
          avatar: "https://via.placeholder.com/40",
        },
        price: 0.00041,
        change1h: 8,
        change24h: -3,
        tokenName: "LA Lakers",
        ticker: "LKRS",
      },
    ]);
  }, [selectedTab]);

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
