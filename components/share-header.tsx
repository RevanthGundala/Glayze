import React from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "@/contexts/theme-context";

type ShareHeaderProps = {
  name: string | string[] | null;
  symbol: string | string[] | null;
  image: string | string[] | null;
};

export const ShareHeader: React.FC<ShareHeaderProps> = ({
  name,
  symbol,
  image,
}) => {
  const { theme } = useTheme();

  return (
    <View className="flex-row items-center">
      <View
        className="border rounded-full overflow-hidden p-1 mr-2"
        style={{ borderColor: theme.mutedForegroundColor }}
      >
        <Image
          source={image ? { uri: image } : require("@/assets/images/icon.png")}
          style={{ width: 24, height: 24 }}
        />
      </View>
      <View>
        <Text className="text-sm" style={{ color: theme.textColor }}>
          ${symbol || "N/A"}
        </Text>
        <Text style={{ color: theme.mutedForegroundColor }}>
          {name || "N/A"}
        </Text>
      </View>
    </View>
  );
};
