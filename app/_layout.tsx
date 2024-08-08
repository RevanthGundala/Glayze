import { Slot } from "expo-router";
import { Providers } from "@/components/providers";
import { useEffect } from "react";
import { SplashScreen } from "expo-router";
import { useRouter, Href } from "expo-router";
import * as Linking from "expo-linking";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  useEffect(() => {
    async function prepare() {
      try {
        console.log("Starting preparation...");
        // Pre-load fonts, make any API calls you need to do here
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating loading
        console.log("Preparation complete");
      } catch (e) {
        console.error("Preparation error:", e);
      } finally {
        console.log("Hiding splash screen");
        SplashScreen.hideAsync();
      }
    }

    prepare();
    // router.push("/(authenticated)/home");
  }, []);

  const handleUrl = async (receivedUrl: string) => {
    console.log("Linking url");
    console.log(receivedUrl);
    try {
      const { handleResponse } = await import(
        "@mobile-wallet-protocol/client/dist/core/communicator/handleResponse"
      );
      console.log(receivedUrl);
      const handled = handleResponse(receivedUrl);
      console.log(handled);
      if (!handled) {
        // If not handled by Coinbase SDK, parse the URL
        const { path, queryParams } = Linking.parse(receivedUrl);

        // Check if this is a successful auth redirect
        if (path === "auth") {
          if (queryParams?.success === "true") {
            // If there's a state parameter, use it to fetch full data
            if (queryParams?.state) {
              // Fetch full data using the state parameter
              // const fullData = await fetchDataFromServer(queryParams.state);
              // Process the full data
            }
            router.replace("/(authenticated)/home" as Href);
          } else {
            console.log("Authentication failed");
            // Handle authentication failure
          }
        } else {
          console.log("Unhandled deeplink:", receivedUrl);
        }
      }
    } catch (error) {
      console.error("Error handling URL:", error);
      // Implement proper error handling here
    }
  };

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("incoming deeplink:", url);
      try {
        handleUrl(url);
      } catch (err) {
        console.error(err);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
