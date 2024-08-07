import React from "react";

import { View, Text, SafeAreaView } from "react-native";
import { Route } from "../../../utils/types";
import { Menu } from "@/components/menu";
import { Header } from "@/components/header";
import {
  GLAYZE_PRIVACY_POLICY,
  GLAYZE_TERMS_OF_SERVICE,
} from "@/utils/constants";
import { useTheme } from "@/contexts/theme-context";

const routes: Route[] = [
  {
    name: "Privacy Policy",
    href: GLAYZE_PRIVACY_POLICY,
  },
  {
    name: "Terms of Service",
    href: GLAYZE_TERMS_OF_SERVICE,
  },
];

export default function PrivacyAndSecurity() {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <View className="py-4">
        <Menu routes={routes} />
      </View>
    </SafeAreaView>
  );
}
