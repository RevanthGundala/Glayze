import React, { useState } from "react";
import { View, Text, Pressable, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/ui/input";
import { Image } from "expo-image";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { useTheme } from "../../../contexts/theme-context";
import { Header } from "@/components/header";
import { SubHeader } from "@/components/sub-header";
import { colors } from "@/utils/theme";
import { client } from "@/utils/dynamic-client.native";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { ActivityIndicator } from "react-native";
import { Loading } from "@/components/loading";
import { supabase } from "@/utils/supabase";

export default function MyAccount() {
  const { theme, themeName } = useTheme();
  const { auth, ui, sdk } = useReactiveClient(client);
  const [isLoading, setIsLoading] = useState(false);

  if (!sdk.loaded) return <Loading />;

  const exportKeys = () => {
    setIsLoading(true);
    ui.wallets.revealEmbeddedWalletKey({
      type: "private-key",
    });
    console.log("🔍 Exporting keys");
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <View className="px-8 pt-4 space-y-4">
        <View className="space-y-2">
          <SubHeader title="Your Wallet" />
          <Text
            style={{ color: theme.mutedForegroundColor }}
            className="text-base font-light"
          >
            Shares are controlled by a self-custody wallet. You can export your
            keys at any time.
          </Text>
          {/* <View className="space-y-2">
            <View className="flex flex-row items-center space-x-2 py-2">
              <Image
                source={
                  themeName === "dark"
                    ? require("@/assets/images/dark/eth.png")
                    : require("@/assets/images/light/eth.png")
                }
                className="w-6 h-6"
              />
              <Text
                style={{ color: theme.textColor }}
                className="text-lg font-bold"
              >
                Ethereum
              </Text>
            </View>
            <Input placeholder={address ?? "Cannot fetch address"} readOnly />
            <Button
              buttonStyle="w-full rounded-lg"
              onPress={exportKeys}
              style={{ backgroundColor: theme.tabBarActiveTintColor }}
            >
              <Text
                className="text-center py-4 font-bold"
                style={{ color: colors.white }}
              >
                {isLoading ? <ActivityIndicator /> : " Export Keys"}
              </Text>
            </Button>
          </View> */}
          <Unlink />
        </View>
        <View>
          <SubHeader title="Delete Account" />
          <DeleteAccount />
        </View>
      </View>
    </SafeAreaView>
  );
}

const Unlink = () => {
  const { theme, themeName } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const { auth, ui } = useReactiveClient(client);

  const handleLogOut = () => {
    setModalVisible(false);
  };

  return (
    <View className="w-full pt-2">
      <View className="flex-row justify-between items-center w-full py-2">
        <Pressable className="flex-1" onPress={() => ui.userProfile.show()}>
          <Text style={{ color: theme.textColor }} className="text-lg">
            Wallet
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
    </View>
  );

  // return (
  //   <View className="w-full pt-2">
  //     <View className="flex-row justify-between items-center w-full py-2">
  //       <Pressable className="flex-1" onPress={() => handleLogOut()}>
  //         <Text style={{ color: theme.textColor }} className="text-lg">
  //           Unlink X
  //         </Text>
  //       </Pressable>
  //       <Image
  //         source={
  //           themeName === "dark"
  //             ? require("@/assets/images/dark/forward-arrow.png")
  //             : require("@/assets/images/light/forward-arrow.png")
  //         }
  //         className="w-4 h-4"
  //       />
  //     </View>
  //     <Modal
  //       animationType="slide"
  //       transparent={true}
  //       visible={modalVisible}
  //       onRequestClose={() => setModalVisible(false)}
  //     >
  //       <TouchableOpacity
  //         activeOpacity={1}
  //         onPress={() => setModalVisible(false)}
  //         className="flex-1 justify-end bg-black/50"
  //       >
  //         <View
  //           style={{ backgroundColor: theme.backgroundColor }}
  //           className="rounded-t-3xl p-6 h-44"
  //         >
  //           <Text
  //             style={{ color: theme.textColor }}
  //             className="text-lg font-medium mb-6 text-center"
  //           >
  //             Unlink your X Account?
  //           </Text>
  //           <View className="flex-row justify-between">
  //             <Button
  //               onPress={() => setModalVisible(false)}
  //               buttonStyle="flex-1 py-3 rounded-lg mr-2"
  //               style={{ backgroundColor: theme.tabBarInactiveTintColor }}
  //             >
  //               <Text style={{ color: colors.white }} className="text-center">
  //                 No
  //               </Text>
  //             </Button>
  //             <Button
  //               onPress={handleLogOut}
  //               buttonStyle="py-3 flex-1 rounded-lg ml-2"
  //               style={{ backgroundColor: theme.tabBarActiveTintColor }}
  //             >
  //               <Text
  //                 style={{ color: theme.tintTextColor }}
  //                 className="text-center"
  //               >
  //                 Unlink
  //               </Text>
  //             </Button>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //     </Modal>
  //   </View>
  // );
};

const DeleteAccount = () => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { auth } = useReactiveClient(client);
  const dynamicId = auth.authenticatedUser?.userId;

  const handleDelete = async () => {
    try {
      if (!dynamicId) throw new Error("No address found");
      setModalVisible(false);
      const { error } = await supabase
        .from("Users")
        .delete()
        .eq("dynamic_id", dynamicId);
      if (error) console.log(error);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View className="w-full pt-4">
      <Pressable
        onPress={() => setModalVisible(true)}
        className="flex-row items-center space-x-2"
      >
        <Image
          source={require("@/assets/images/aux/trash.png")}
          className="w-5 h-5"
        />
        <Text style={{ color: colors.redTintColor }} className="text-lg">
          Delete Account
        </Text>
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
          <View
            style={{ backgroundColor: theme.backgroundColor }}
            className="rounded-t-3xl p-6 h-[250px]"
          >
            <Text
              style={{ color: theme.textColor }}
              className="text-lg font-medium text-center"
            >
              Are you sure you want to delete your account?
            </Text>
            <Text
              style={{ color: theme.mutedForegroundColor }}
              className="text-center py-4"
            >
              This action is irreversible and will delete all your data.
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
                onPress={handleDelete}
                buttonStyle="py-3 flex-1 rounded-lg ml-2"
                style={{ backgroundColor: colors.redTintColor }}
              >
                <Text
                  style={{ color: colors.white }}
                  className="font-semibold text-center"
                >
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
