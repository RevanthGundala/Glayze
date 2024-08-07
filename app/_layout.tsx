import { Slot } from "expo-router";
import { Providers } from "@/components/providers";
import { useEffect } from "react";
import { SplashScreen } from "expo-router";
import { useRouter } from "expo-router";

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

  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
