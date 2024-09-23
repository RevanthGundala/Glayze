import { Slot } from "expo-router";
import { Providers } from "@/components/providers";
import { NativeWindStyleSheet } from "nativewind";
import { usePWA } from "@/hooks";
import { View, Text } from "react-native";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function RootLayout() {
  const isPWA = usePWA();
  if (isPWA) {
    return (
      <View>
        <Text>Download app</Text>
      </View>
    );
  }
  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
