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
        className="border rounded-full overflow-hidden mr-2"
        style={{ borderColor: theme.mutedForegroundColor }}
      >
        <Image
          source={{ uri: (image as string) || "" }}
          className="w-9 h-9 rounded-full "
          resizeMode="cover"
        />
      </View>
      <View>
        <Text className="text-sm" style={{ color: theme.textColor }}>
          ${symbol || "$N/A"}
        </Text>
        <Text style={{ color: theme.mutedForegroundColor }}>
          {name || "N/A"}
        </Text>
      </View>
    </View>
  );
};
