import { Slot } from "expo-router";
import { Providers } from "@/components/providers";
import { useEffect } from "react";
import { SplashScreen } from "expo-router";
import { useRouter, Href } from "expo-router";
import * as Linking from "expo-linking";
import Purchases from "react-native-purchases";
import { useURL } from "@/contexts/url-context";
import { useState } from "react";
import { Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const url = useBetterURL();
  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       console.log("Starting preparation...");
  //       // Pre-load fonts, make any API calls you need to do here
  //       await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating loading
  //       console.log("Preparation complete");
  //     } catch (e) {
  //       console.error("Preparation error:", e);
  //     } finally {
  //       console.log("Hiding splash screen");
  //       SplashScreen.hideAsync();
  //     }
  //   }

  //   prepare();
  //   // router.push("/(authenticated)/home");
  // }, []);

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

  // useEffect(() => {
  //   Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  //   Purchases.configure({
  //     apiKey: process.env.EXPO_PUBLIC_PURCHASES_APPLE_API_KEY!,
  //     appUserID: null,
  //     useAmazon: false,
  //   });
  // }, []);

  return (
    <Providers>
      <Slot />
    </Providers>
  );
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
