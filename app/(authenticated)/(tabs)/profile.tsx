import { View, Text, Modal, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Route } from "../../../utils/types";
import { Menu } from "@/components/Menu";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useProfile } from "@/hooks/useProfile";
import { usePrivy } from "@privy-io/expo";
import {
  GLAYZE_TWITTER,
  GLAYZE_DISCORD,
  GLAYZE_PRIVACY_POLICY,
} from "@/utils/constants";

export default function Profile() {
  const { data, isLoading, isError } = useProfile();

  if (isLoading)
    return (
      <View className="flex-1 bg-background">
        <Text>Loading...</Text>
      </View>
    );
  if (isError)
    return (
      <View className="flex-1 bg-background">
        <Text>Error loading profile</Text>
      </View>
    );
  if (!data)
    return (
      <View className="flex-1 bg-background">
        <Text>No profile data found</Text>
      </View>
    );

  const { name, handle, profile_pic } = data;
  const routes: Route[] = [
    {
      name: "My Account",
      href: "/(authenticated)/profile/my-account",
    },
    // {
    //   name: "Contact Support",
    //   href: "/",
    // },
    {
      name: "Privacy and Security",
      href: GLAYZE_PRIVACY_POLICY,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
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
            <Text className="text-white text-2xl font-semibold">{name}</Text>
            <Text className="text-white text-lg opacity-80">@{handle}</Text>
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
          <Text className="text-white text-lg opacity-80">Log Out</Text>
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
          <View className="bg-background rounded-t-3xl p-6 h-44">
            <Text className="text-white text-lg font-medium mb-6 text-center">
              Are you sure you want to log out?
            </Text>
            <View className="flex-row justify-between">
              <Button
                onPress={() => setModalVisible(false)}
                buttonStyle="bg-neutral flex-1 py-3 rounded-lg mr-2"
              >
                <Text className="text-white text-center">No</Text>
              </Button>
              <Button
                onPress={handleLogOut}
                buttonStyle="bg-primary py-3 flex-1 rounded-lg ml-2"
              >
                <Text className="text-black text-center">Log Out</Text>
              </Button>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const Socials = () => {
  return (
    <View className="mt-36">
      <Text className="text-white text-sm opacity-70 text-center mb-4">
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
