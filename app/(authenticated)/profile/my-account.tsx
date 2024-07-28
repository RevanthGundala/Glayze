import React, { useState } from "react";
import { View, Text, Pressable, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackArrow } from "@/components/ui/BackArrow";
import { Input } from "@/components/ui/Input";
import { Menu } from "@/components/Menu";
import { Image } from "expo-image";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";

export default function MyAccount() {
  const address = "0x1234567890123456789012345678901234567890";
  const connectedAccounts = [
    { name: "Unlink X Account", href: "/profile/my-account" },
  ];
  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackArrow />
      <View className="px-8 pt-4 space-y-4">
        <View className="space-y-2">
          <Text className="text-white text-2xl font-bold">Your Wallet</Text>
          <Text className="text-white text-base font-light opacity-50">
            Tokens are held in an embedded self-custody crypto wallet. You will
            be able export your keys in the future.
          </Text>
        </View>
        <View className="space-y-2">
          <View className="flex flex-row items-center space-x-2 py-2">
            <Image
              source={require("@/assets/images/eth.png")}
              className="w-6 h-6"
            />
            <Text className="text-white text-lg font-bold ">Ethereum</Text>
          </View>
          <Input placeholder={address} readOnly />
        </View>
        <Text className="text-white text-2xl font-bold">
          Connected Accounts
        </Text>
        <Unlink />
        <View>
          <Text className="text-white text-2xl font-bold py-4">
            Delete Account
          </Text>
          <DeleteAccount />
        </View>
      </View>
    </SafeAreaView>
  );
}

// TODO: Based on if they have linked or not.
const Unlink = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogOut = () => {
    setModalVisible(false);
  };

  return (
    <View className="w-full pt-4">
      <View className="flex-row justify-between items-center w-full py-2">
        <Pressable className="flex-1" onPress={() => setModalVisible(true)}>
          <Text className="text-white text-lg opacity-80">Unlink X</Text>
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
              Unlink your X Account?
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
                <Text className="text-black text-center">Unlink</Text>
              </Button>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const DeleteAccount = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    setModalVisible(false);
    router.push("/");
  };
  return (
    <View>
      <Pressable
        onPress={() => setModalVisible(true)}
        className="flex-row items-center space-x-2"
      >
        <Image
          source={require("@/assets/images/trash.png")}
          className="w-5 h-5"
        />
        <Text className="text-red-500 text-lg">Delete Account</Text>
      </Pressable>
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
          <View className="bg-background rounded-t-3xl p-6 h-[200px]">
            <Text className="text-white text-lg font-medium text-center">
              Are you sure you want to delete your account?
            </Text>
            <Text className="text-white text-center opacity-70 py-4">
              This action is irreversible and will delete all your data.
            </Text>
            <View className="flex-row justify-between">
              <Button
                onPress={() => setModalVisible(false)}
                buttonStyle="bg-neutral flex-1 py-3 rounded-lg mr-2"
              >
                <Text className="text-white text-center">No</Text>
              </Button>
              <Button
                onPress={handleDelete}
                buttonStyle="bg-red-400 py-3 flex-1 rounded-lg ml-2"
              >
                <Text className="text-white font-semibold text-center">
                  Delete
                </Text>
              </Button>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
