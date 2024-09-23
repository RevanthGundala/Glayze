import { Slot } from "expo-router";
import { Providers } from "@/components/providers";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "web",
});

export default function RootLayout() {
  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
