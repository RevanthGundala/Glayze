import React from "react";
import { Image } from "react-native";
import {
  useRouter,
  useLocalSearchParams,
  useSegments,
  usePathname,
} from "expo-router";
import { useTheme } from "@/contexts/theme-context";
import { TouchableOpacity } from "react-native";

export const BackArrow = () => {
  const { themeName } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      {themeName === "dark" ? (
        <Image
          source={require("@/assets/images/dark/back.png")}
          className="w-4 h-4"
        />
      ) : (
        <Image
          source={require("@/assets/images/light/back.png")}
          className="w-4 h-4"
        />
      )}
    </TouchableOpacity>
  );
};
