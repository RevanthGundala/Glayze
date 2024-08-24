import { Link, Slot } from "expo-router";
import { Providers } from "@/components/providers";
import { useRouter } from "expo-router";
import { Platform, View, Text } from "react-native";
import * as Linking from "expo-linking";
import { Button } from "@/components/ui/button";
import { Image } from "expo-image";
import appleIcon from "@/assets/images/socials/apple.png";
import icon from "@/assets/images/icon.png";
import { NativeWindStyleSheet } from "nativewind";
import { GLAYZE_DISCORD, GLAYZE_TWITTER } from "@/utils/constants";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const WebLayout = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-black">
      <View className="mt-8 mb-4 items-center">
        <Image source={icon} className="w-20 h-20" />
      </View>
      <View>
        <Image
          source={require("@/assets/images/aux/iphone.png")}
          style={{
            width: 450,
            height: 450,
            alignSelf: "center",
          }}
          alt="Iphone"
          className="text-black"
          contentFit="contain"
        />
      </View>
      <View className="flex items-center justify-center mt-20">
        <Button
          buttonStyle="w-1/3 rounded-full py-3 border border-gray-200 flex-row items-center justify-center bg-white"
          onPress={() => router.push("/")}
        >
          <Image source={appleIcon} className="w-4 h-4 mr-3" />
          <Text className="text-center text-black">
            Download Glayze on the App store
          </Text>
        </Button>
      </View>
      <View className="mt-6">
        <View className="flex-row justify-center items-center space-x-8">
          <Link href={GLAYZE_TWITTER} className="hover:pointer-cursor">
            <Image
              source={require("@/assets/images/dark/twitter.png")}
              className="w-6 h-6"
            />
          </Link>
          <Link href={GLAYZE_DISCORD} className="hover:pointer-cursor">
            <Image
              source={require("@/assets/images/dark/discord.png")}
              className="w-8 h-8"
            />
          </Link>
        </View>
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
