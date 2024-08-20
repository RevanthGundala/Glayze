import { Slot } from "expo-router";
import { Providers } from "@/components/providers";
import { useRouter } from "expo-router";
import { Platform, View, Text } from "react-native";
import * as Linking from "expo-linking";
import { Button } from "@/components/ui/button";
import { Image } from "expo-image";
import appleIcon from "@/assets/images/socials/apple.png";
import icon from "@/assets/images/icon.png";
import { NativeWindStyleSheet } from "nativewind";
import { useEffect } from "react";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const WebLayout = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      <View className="mt-40">
        <Image source={icon} className="w-1/2 h-1/2" />
      </View>
      <View className="flex items-center justify-center mt-20">
        <Button
          buttonStyle="w-1/2 rounded-full py-3 border border-gray-200 flex-row items-center justify-center bg-white"
          onPress={() => router.push("/")}
        >
          <Image source={appleIcon} className="w-4 h-4 mr-3" />
          <Text className="text-center text-black">
            Download Glayze on the App store
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default function RootLayout() {
  if (Platform.OS === "web") {
    return <WebLayout />;
  }

  const url = Linking.useURL();
  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log(
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams
      )}`
    );
  }

  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
