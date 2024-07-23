import React from "react";

import { View, Text, SafeAreaView } from "react-native";
import { Route } from "../../../types/types";
import { Menu } from "@/components/Menu";
import { BackArrow } from "@/components/ui/BackArrow";

const routes: Route[] = [
  {
    name: "Privacy Policy",
    href: "/",
  },
  {
    name: "Terms of Service",
    href: "/",
  },
];

export default function PrivacyAndSecurity() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <BackArrow />
      <View className="py-4">
        <Menu routes={routes} />
      </View>
    </SafeAreaView>
  );
}
