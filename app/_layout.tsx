import { Slot } from "expo-router";
import { Providers } from "@/components/providers";
import { NativeWindStyleSheet } from "nativewind";
import { usePWA } from "@/hooks";
NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function RootLayout() {
  // const isPWA = usePWA();
  // if (!isPWA) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-black">
  //       <Text className="text-white text-lg">Download app</Text>
  //     </View>
  //   );
  // }
  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
