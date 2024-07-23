import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import { Link } from "expo-router";
import { Item } from "@/types/types";

type ItemComponentProps = {
  item: Item;
};

export const ItemComponent = ({ item }: ItemComponentProps) => {
  return (
    <Link href={`/item/${item.id}`} key={item.id} asChild>
      <TouchableOpacity className="bg-background border-b-2 border-neutral overflow-hidden">
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center flex-1">
              <Image
                source={{ uri: item.user.avatar }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
              <View className="ml-2 flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className="font-medium text-white">
                    {item.user.name}
                  </Text>
                  <Text className="text-lg text-white">${item.ticker}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-white">{item.user.handle}</Text>
                  <Text className="text-white">{item.tokenName}</Text>
                </View>
              </View>
            </View>
          </View>
          <Image
            source={{ uri: "https://via.placeholder.com/300x200" }}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-xl font-bold text-white">
              ${item.price.toFixed(5)}
            </Text>
            <View className="flex-row">
              <Text
                className={`mr-2 text-lg ${
                  item.change1h >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                1H: {item.change1h}%
              </Text>
              <Text
                className={`text-lg ${
                  item.change24h >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                24H: {item.change24h}%
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
