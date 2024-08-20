import React, { useEffect, useState } from "react";
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
import { Loading } from "@/components/loading";
import { supabase } from "@/utils/supabase";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Controller, useForm } from "react-hook-form";
import { useReferral } from "@/hooks";
import { useSmartAccount } from "@/contexts/smart-account-context";
import { useLinkWithOAuth, usePrivy } from "@privy-io/expo";
import { GlayzeToast } from "@/components/ui/glayze-toast";

interface FormData {
  referralAddress: string;
}

export default function MyAccount() {
  const { theme, themeName } = useTheme();
  const { smartAccountClient, error: smartAccountError } = useSmartAccount();
  const address = smartAccountClient?.account.address;
  const { data: referrals } = useReferral(address);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      referralAddress: "",
    },
  });

  const handleReferral = async (data: FormData) => {
    const { error } = await supabase.from("Referrals").insert([
      {
        referrer: data.referralAddress,
        referee: address,
        show: true,
        pending: true,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.log(error);
      Toast.show({
        text1: "Error submitting referral",
        text2: "Please try again",
        type: "error",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    } else {
      Toast.show({
        text1: "Referral submitted",
        text2: "You will receieve $AURA when your friend makes a trade",
        type: "success",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <GlayzeToast />
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
            Shares are controlled by a self-custody wallet. Export your keys
            soon!
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
          <View className="py-4">
            <SubHeader title="Referral" />
            <Text
              style={{ color: theme.mutedForegroundColor }}
              className="font-light pb-2"
            >
              Did someone refer you? Enter their address here
            </Text>
            <Controller
              control={control}
              rules={{
                pattern: {
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Invalid Ethereum address",
                },
              }}
              render={({ field: { onChange, value } }) =>
                referrals?.length === 0 ? (
                  <Input
                    placeholder={"0x..."}
                    style={{ backgroundColor: theme.textColor }}
                    onChangeText={onChange}
                    value={value}
                  />
                ) : (
                  <></> //TODO: get the address that this person was referred by
                )
              }
              name="referralAddress"
            />
            {errors.referralAddress && (
              <Text style={{ color: "red" }}>
                {errors.referralAddress.message}
              </Text>
            )}
            {referrals?.length === 0 && (
              <Button
                buttonStyle="w-full rounded-lg my-4"
                disabled={errors.referralAddress}
                style={{
                  backgroundColor: !errors.referralAddress
                    ? theme.tabBarActiveTintColor
                    : theme.tabBarInactiveTintColor,
                }}
                onPress={handleSubmit(handleReferral)}
              >
                <Text
                  className="text-center font-semibold py-4"
                  style={{ color: colors.white }}
                >
                  Submit
                </Text>
              </Button>
            )}
          </View>
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
  const { user } = usePrivy();
  const { link } = useLinkWithOAuth({
    onSuccess: () => {
      setModalVisible(false);
    },
    onError: (error) => {
      setModalVisible(false);
      console.log(error);
      Toast.show({
        text1: "Error linking your X account",
        text2: "Please try again",
        type: "error",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    },
  });
  const [isConnectedToX, setIsConnectedToX] = useState(false);

  useEffect(() => {
    const account = user?.linked_accounts.find(
      (account) => account.type === "twitter_oauth"
    );
    if (account) setIsConnectedToX(true);
  }, [isConnectedToX, user]);

  return (
    <View className="w-full pt-2">
      <View className="flex-row justify-between items-center w-full py-2">
        {isConnectedToX ? null : ( // </Pressable> //   </Text> //     Contact Us To Unlink Your X Account //   <Text style={{ color: theme.textColor }} className="text-lg"> // <Pressable className="flex-1" onPress={() => {}}>
          <Pressable className="flex-1" onPress={() => setModalVisible(true)}>
            <Text style={{ color: theme.textColor }} className="text-lg">
              Link Your X Account
            </Text>
          </Pressable>
        )}
        {!isConnectedToX && (
          <Image
            source={
              themeName === "dark"
                ? require("@/assets/images/dark/forward-arrow.png")
                : require("@/assets/images/light/forward-arrow.png")
            }
            className="w-4 h-4"
          />
        )}
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
              Link your X Account?
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
                onPress={() => link({ provider: "twitter" })}
                buttonStyle="py-3 flex-1 rounded-lg ml-2"
                style={{ backgroundColor: theme.tabBarActiveTintColor }}
              >
                <Text
                  style={{ color: theme.tintTextColor }}
                  className="text-center"
                >
                  Link
                </Text>
              </Button>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  const { user } = usePrivy();

  const handleDelete = async () => {
    try {
      if (!user?.id) throw new Error("No address found");
      setModalVisible(false);
      const { error } = await supabase
        .from("Users")
        .delete()
        .eq("privy_id", user?.id);
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
