import { Slot } from "expo-router";
import { Providers } from "@/components/providers";
import { useEffect } from "react";
import { useRouter, Href } from "expo-router";
import * as Linking from "expo-linking";
import Purchases from "react-native-purchases";
import { useState } from "react";
import { Platform } from "react-native";
import { client } from "@/utils/dynamic-client";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { View, Text, Image } from "react-native";
import { Button } from "@/components/ui/button";
import appleIcon from "../assets/images/socials/apple.png";

export default function RootLayout() {
  const router = useRouter();
  const { auth } = useReactiveClient(client);
  const url = useBetterURL();

  useEffect(() => {
    if (auth.token && !auth.authenticatedUser?.newUser) {
      router.replace("/(authenticated)/(tabs)/home" as Href);
    }
  }, [auth.token, router]);

  const handleUrl = async (receivedUrl: string) => {
    try {
      if (Platform.OS === "web") return; // TODO: Handle web
      console.log("Linking url");
      console.log("url: ", receivedUrl);
      const { handleResponse } = await import(
        "@mobile-wallet-protocol/client/dist/core/communicator/handleResponse.native"
      );
      const handled = handleResponse("http://192.168.1.4:8081");
      console.log(handled);
      if (handled) {
        router.replace("/(authenticated)/home" as Href);
      } else {
        console.log("Unhandled deeplink:", receivedUrl);
      }
      return handled;
    } catch (error) {
      console.error("Error handling URL:", error);
      // Implement proper error handling here
    }
  };

  useEffect(() => {
    console.log("RootLayout useEffect running");
    if (!url) console.log("No url");
    else {
      const { hostname, path, queryParams } = Linking.parse(url);
      console.log(
        `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
          queryParams
        )}`
      );
      handleUrl(url).then((handled) => {
        console.log("handled", handled);
      });
    }
  }, [url]);

  // useEffect(() => {
  //   const subscription = Linking.addEventListener("url", ({ url }) => {
  //     console.log("incoming deeplink:", url);
  //     try {
  //       handleUrl(url).then((handled) => {
  //         console.log("handled", handled);
  //       });
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   });

  //   return () => subscription.remove();
  // }, []);

  useEffect(() => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    Purchases.configure({
      apiKey: process.env.EXPO_PUBLIC_PURCHASES_APPLE_API_KEY!,
      appUserID: null,
      useAmazon: false,
    });
  }, []);

  if (Platform.OS === "web") {
    console.log("Only available on iOS!");
    return (
      <View className="flex-1 bg-black">
        <View className="mt-40">
          <Text className="text-white font-semibold">Glayze</Text>
        </View>
        <View className="flex items-center justify-center mt-20">
          <Button
            buttonStyle="w-1/2 rounded-full py-3 border border-gray-200 flex-row items-center justify-center bg-blue-400"
            onPress={() => router.push("/")}
          >
            <Image source={appleIcon} className="w-4 h-4 mr-3" />
            <Text className="text-center text-white">
              Download on the App store
            </Text>
          </Button>
        </View>
      </View>
    );
  } else {
    return (
      <Providers>
        <Slot />
      </Providers>
    );
  }
}

const useBetterURL = (): string | null | undefined => {
  const url = Linking.useURL();
  const [urlState, setUrlState] = useState<string | null | undefined>(
    undefined
  );

  useEffect(() => {
    async function updateURL() {
      if (urlState === undefined) {
        // It seems like url is always null from the useURL (possibly because of the async nature of getInitialURL) until we explicitly call getInitialUrl.
        // So therefore, first time the URL gets a value from useURL, we call getInitialURL ourselves to get the first value.
        // See https://github.com/expo/expo/issues/23333
        const initialUrl = await Linking.getInitialURL();
        setUrlState(initialUrl);
        return;
      }

      if (url === urlState) {
        return;
      }

      setUrlState(url);
    }

    void updateURL();
  }, [url, urlState]);

  return urlState;
};
