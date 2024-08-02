import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Route } from "../../../utils/types";
import { Menu } from "@/components/menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "../../../contexts/user-context";
import { useTheme } from "../../../contexts/theme-context";
import { usePrivy } from "@/utils/privy";
import {
  GLAYZE_TWITTER,
  GLAYZE_DISCORD,
  GLAYZE_PRIVACY_POLICY,
} from "@/utils/constants";

export default function Profile() {
  const { theme, themeName } = useTheme();
  const { data, isLoading, error } = useUser();

  if (isLoading)
    return (
      <View
        className="flex items-center justify-center"
        style={{ flex: 1, backgroundColor: theme.backgroundColor }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  if (error)
    return (
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <Text style={{ color: theme.textColor }}>Error loading profile</Text>
      </View>
    );
  if (!data)
    return (
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <Text style={{ color: theme.textColor }}>No profile data found</Text>
      </View>
    );

  const { name, handle, profile_pic } = data.db;
  const routes: Route[] = [
    {
      name: "My Account",
      href: "/(authenticated)/profile/my-account",
    },
    {
      name: "Appearance",
      href: "/(authenticated)/profile/appearance",
    },
    {
      name: "Privacy and Security",
      href: GLAYZE_PRIVACY_POLICY,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View className="mt-16 items-center">
        <View className="items-center py-8 space-y-4">
          <Image
            source={
              profile_pic
                ? { uri: profile_pic }
                : require("@/assets/images/tabs/profile.png")
            }
            className="w-16 h-16"
          />
          <View className="pb-8 items-center">
            <Text
              style={{ color: theme.textColor }}
              className="text-2xl font-semibold"
            >
              {name}
            </Text>
            <Text
              style={{ color: theme.mutedForegroundColor }}
              className="text-lg"
            >
              @{handle}
            </Text>
            <Link
              href={`https://x.com/${handle}`}
              className="mt-2 hover:pointer-cursor"
            >
              <Image
                source={
                  themeName === "dark"
                    ? require("@/assets/images/x.png")
                    : require("@/assets/images/x-dark.png")
                }
                className="w-6 h-6"
              />
            </Link>
          </View>
          <Menu routes={routes} />
          <LogOut />
          <Socials />
        </View>
      </View>
    </SafeAreaView>
  );
}

const LogOut = () => {
  const { theme, themeName } = useTheme();
  const { logout } = usePrivy();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogOut = () => {
    setModalVisible(false);
    logout();
    router.replace("/");
  };

  return (
    <View className="w-full pt-4 px-6">
      <View className="flex-row justify-between items-center w-full py-2">
        <Pressable className="flex-1" onPress={() => setModalVisible(true)}>
          <Text style={{ color: theme.textColor }} className="text-lg">
            Log Out
          </Text>
        </Pressable>
        <Image
          source={
            themeName === "dark"
              ? require("@/assets/images/forward-arrow.png")
              : require("@/assets/images/forward-arrow-dark.png")
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
                <Text
                  style={{ color: theme.textColor }}
                  className="text-center"
                >
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
      <Text style={{ color: theme.textColor }} className="text-center mb-4">
        Connect
      </Text>
      <View className="flex-row justify-center items-center space-x-8">
        <Link href={GLAYZE_TWITTER} className="hover:pointer-cursor">
          <Image
            source={
              themeName === "dark"
                ? require("@/assets/images/socials/twitter.png")
                : require("@/assets/images/socials/twitter-dark.png")
            }
            className="w-6 h-6"
          />
        </Link>
        <Link href={GLAYZE_DISCORD} className="hover:pointer-cursor">
          <Image
            source={
              themeName === "dark"
                ? require("@/assets/images/socials/discord.png")
                : require("@/assets/images/socials/discord-dark.png")
            }
            className="w-8 h-8"
          />
        </Link>
      </View>
    </View>
  );
};
