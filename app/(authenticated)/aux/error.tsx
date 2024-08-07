import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Button } from "@/components/ui/button";
import { colors } from "@/utils/theme";
import { useTheme } from "@/contexts/theme-context";

export default function Error() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 justify-center items-center px-6"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="items-center mb-20">
        <Image
          source={require("@/assets/images/aux/error.png")}
          style={{ width: 100, height: 100 }}
          className="mb-6"
        />
        <Text
          className="text-center mb-8 px-10 leading-5"
          style={{ color: theme.textColor }}
        >
          Something went wrong. Please try again. {"\n"} If the problem
          persists, please contact support.
        </Text>
      </View>

      <Button
        buttonStyle="py-4 px-8 rounded-full"
        onPress={() => router.replace("../")}
        style={{ backgroundColor: theme.tabBarActiveTintColor }}
      >
        <Text
          className="text-black text-lg font-medium"
          style={{ color: colors.white }}
        >
          Try Again
        </Text>
      </Button>
    </SafeAreaView>
  );
}
