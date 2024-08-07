import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Href, useRouter } from "expo-router";
import { useTheme } from "@/contexts/theme-context";
import { colors } from "@/utils/theme";
import { Button } from "@/components/ui/button";

export default function NotFoundScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex-1 items-center justify-center mb-40 space-y-8">
        <Text className="text-2xl" style={{ color: theme.textColor }}>
          Sorry, we couldn't find that post 😔
        </Text>
        <Button
          buttonStyle="rounded-full"
          onPress={() => router.push("/(authenticated)/home" as Href)}
          style={{ backgroundColor: theme.tabBarActiveTintColor }}
        >
          <Text
            className="text-center px-4 py-3 font-semibold"
            style={{ color: colors.white }}
          >
            Back to Home
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
