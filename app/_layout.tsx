import { Slot } from "expo-router";
import { Providers } from "@/components/providers";
import { useEffect } from "react";
import { useRouter, Href } from "expo-router";
import * as Linking from "expo-linking";
import Purchases from "react-native-purchases";
import { useState } from "react";
import { Platform } from "react-native";
import { client } from "@/utils/dynamic-client.native";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { Image } from "expo-image";
import appleIcon from "@/assets/images/socials/apple.png";
import icon from "@/assets/images/icon.png";
import { NativeWindStyleSheet } from "nativewind";
import { upsertUser } from "@/utils/helpers";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function RootLayout() {
  const router = useRouter();
  // if (Platform.OS === "web") {
  //   console.log("Showing web layout");
  //   return (
  //     <View className="flex-1 bg-white">
  //       <View className="mt-40">
  //         <Image source={icon} className="w-1/2 h-1/2" />
  //       </View>
  //       <View className="flex items-center justify-center mt-20">
  //         <Button
  //           buttonStyle="w-1/2 rounded-full py-3 border border-gray-200 flex-row items-center justify-center bg-white"
  //           onPress={() => router.push("/")}
  //         >
  //           <Image source={appleIcon} className="w-4 h-4 mr-3" />
  //           <Text className="text-center text-black">
  //             Download Glayze on the App store
  //           </Text>
  //         </Button>
  //       </View>
  //     </View>
  //   );
  // }

  const { auth } = useReactiveClient(client);

  useEffect(() => {
    if (auth.token && !auth.authenticatedUser?.newUser) {
      router.replace("/(authenticated)/(tabs)/home" as Href<string>);
    }
  }, [auth.token, router]);

  useEffect(() => {
    if (auth.authenticatedUser?.verifiedCredentials) {
      const xUserId =
        auth.authenticatedUser?.verifiedCredentials?.[2]?.oauthAccountId?.toString();
      upsertUser(auth.authenticatedUser?.userId, {
        xUserId,
      }).catch((error) => console.log(error));
    }
  }, [auth.authenticatedUser?.verifiedCredentials]);

  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
