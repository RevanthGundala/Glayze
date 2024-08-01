import { View, Text, Modal, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Route } from "../../../utils/types";
import { Menu } from "@/components/menu";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useProfile } from "@/hooks/use-profile";
import { usePrivy } from "@privy-io/expo";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  GLAYZE_TWITTER,
  GLAYZE_DISCORD,
  GLAYZE_PRIVACY_POLICY,
} from "@/utils/constants";

export default function Profile() {
  const { theme } = useTheme();
  const { data, isLoading, isError } = useProfile();

  if (isLoading)
    return (
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <Text style={{ color: theme.textColor }}>Loading...</Text>
      </View>
    );
  if (isError)
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

  const { name, handle, profile_pic } = data;
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
                : require("@/assets/images/icon.png")
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
                source={require("@/assets/images/x.png")}
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
  const { theme } = useTheme();
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
          <Text
            style={{ color: theme.mutedForegroundColor }}
            className="text-lg"
          >
            Log Out
          </Text>
        </Pressable>
        <Image
          source={require("@/assets/images/forward-arrow.png")}
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
                buttonStyle="bg-neutral flex-1 py-3 rounded-lg mr-2"
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
                buttonStyle="bg-primary py-3 flex-1 rounded-lg ml-2"
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
  const { theme } = useTheme();

  return (
    <View className="mt-36">
      <Text
        style={{ color: theme.mutedForegroundColor }}
        className="text-sm text-center mb-4"
      >
        Connect
      </Text>
      <View className="flex-row justify-center items-center space-x-8">
        <Link href={GLAYZE_TWITTER} className="hover:pointer-cursor">
          <Image
            source={require("@/assets/images/socials/twitter.png")}
            className="w-6 h-6 opacity-70"
          />
        </Link>
        <Link href={GLAYZE_DISCORD} className="hover:pointer-cursor">
          <Image
            source={require("@/assets/images/socials/discord.png")}
            className="w-8 h-8 opacity-70"
          />
        </Link>
      </View>
    </View>
  );
};
