import { View, Text, Modal, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Route } from "../../../utils/types";
import { Menu } from "@/components/menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { GLAYZE_TWITTER, GLAYZE_DISCORD } from "@/utils/constants";
import { Header } from "@/components/header";
import { colors } from "@/utils/theme";
import { usePrivy } from "@privy-io/react-auth";

const routes: Route[] = [
  {
    name: "My Account",
    href: "/(authenticated)/profile/my-account",
  },
  {
    name: "Appearance",
    href: "/(authenticated)/profile/appearance",
  },
  // {
  //   name: "Privacy and Legal",
  //   href: "/(authenticated)/profile/privacy-and-legal",
  // },
];

export default function Profile() {
  const { theme, themeName } = useTheme();
  const { user } = usePrivy();
  const xAccount = user?.linkedAccounts?.find(
    (acc) => acc.type === "twitter_oauth"
  );
  const name = xAccount?.name ?? "Anon";
  const handle = xAccount?.username ?? "Anon";
  const image = xAccount?.profilePictureUrl ?? "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <View className="items-center space-y-4">
        {image ? (
          <Image source={{ uri: image }} className="w-20 h-20 rounded-full" />
        ) : (
          <Image
            source={require("@/assets/images/aux/profile.png")}
            className="w-20 h-20"
            style={{ opacity: 0.8, tintColor: theme.mutedForegroundColor }}
          />
        )}
        <View className="pb-8 items-center">
          <Text
            style={{ color: theme.textColor }}
            className="text-xl font-semibold"
          >
            {name}
          </Text>
          <Text
            style={{ color: theme.mutedForegroundColor }}
            className="text-lg"
          >
            @{handle}
          </Text>
          <Link href={`https://x.com/${handle}`} className="mt-3">
            <Image
              source={
                themeName === "dark"
                  ? require("@/assets/images/dark/x.png")
                  : require("@/assets/images/light/x.png")
              }
              className="w-6 h-6"
            />
          </Link>
        </View>
        <Menu routes={routes} />
        <LogOut />
        <Socials />
      </View>
    </SafeAreaView>
  );
}

const LogOut = () => {
  const { theme, themeName } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { user, logout } = usePrivy();

  const handleLogOut = async () => {
    setModalVisible(false);
    await logout();
    router.replace("/");
  };

  return (
    <View className="w-full pt-4 px-6">
      <View className="flex-row justify-between items-center w-full py-2">
        <Pressable
          className="flex-1"
          onPress={() => (user ? setModalVisible(true) : router.push("/login"))}
        >
          <Text style={{ color: theme.textColor }} className="text-lg">
            {user ? "Log Out" : "Login"}
          </Text>
        </Pressable>
        <Image
          source={
            themeName === "dark"
              ? require("@/assets/images/dark/forward-arrow.png")
              : require("@/assets/images/light/forward-arrow.png")
          }
          className="w-4 h-4"
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 justify-end bg-black/50"
        >
          <View
            style={{ backgroundColor: theme.backgroundColor }}
            className="rounded-t-3xl p-6 h-44"
          >
            <Text
              style={{ color: theme.textColor }}
              className="text-lg font-medium mb-6 text-center"
            >
              Are you sure you want to log out?
            </Text>
            <View className="flex-row justify-between">
              <Button
                onPress={() => setModalVisible(false)}
                buttonStyle="flex-1 py-3 rounded-lg mr-2"
                style={{ backgroundColor: theme.tabBarInactiveTintColor }}
              >
                <Text style={{ color: colors.white }} className="text-center">
                  No
                </Text>
              </Button>
              <Button
                onPress={handleLogOut}
                buttonStyle="py-3 flex-1 rounded-lg ml-2"
                style={{ backgroundColor: theme.tabBarActiveTintColor }}
              >
                <Text
                  style={{ color: theme.tintTextColor }}
                  className="text-center"
                >
                  Log Out
                </Text>
              </Button>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const Socials = () => {
  const { theme, themeName } = useTheme();

  return (
    <View className="mt-16">
      <View className="flex-row justify-center items-center space-x-8">
        <Link href={GLAYZE_TWITTER} className="hover:pointer-cursor">
          <Image
            source={
              themeName === "dark"
                ? require("@/assets/images/dark/twitter.png")
                : require("@/assets/images/light/twitter.png")
            }
            className="w-6 h-6"
          />
        </Link>
        <Link href={GLAYZE_DISCORD} className="hover:pointer-cursor">
          <Image
            source={
              themeName === "dark"
                ? require("@/assets/images/dark/discord.png")
                : require("@/assets/images/light/discord.png")
            }
            className="w-8 h-8"
          />
        </Link>
      </View>
    </View>
  );
};
