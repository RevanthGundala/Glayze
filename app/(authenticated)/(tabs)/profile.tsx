import { View, Text, Modal, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Route } from "../../../utils/types";
import { Menu } from "@/components/Menu";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function Profile() {
  const name = "Emma Watson";
  const handle = "@emmawatson";
  const routes: Route[] = [
    {
      name: "My Account",
      href: "/(authenticated)/profile/my-account",
    },
    {
      name: "Contact Support",
      href: "/", // TODO: change to twitter link
    },
    {
      name: "Privacy and Security",
      href: "/(authenticated)/profile/privacy-and-security",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mt-16 items-center">
        <View className="items-center py-8 space-y-4">
          <Image
            source={require("@/assets/images/icon.png")}
            className="w-16 h-16"
          />
          <View className="pb-8 items-center">
            <Text className="text-white text-2xl font-semibold">{name}</Text>
            <Text className="text-white text-lg opacity-80">{handle}</Text>
            <Link href="/(authenticated)/(tabs)/home" className="mt-2">
              <Image
                source={require("@/assets/images/x.png")}
                className="w-6 h-6"
              />
            </Link>
          </View>
          <Menu routes={routes} />
          <LogOut />
        </View>
      </View>
    </SafeAreaView>
  );
}

const LogOut = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogOut = () => {
    setModalVisible(false);
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
