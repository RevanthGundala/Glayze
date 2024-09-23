import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SectionList,
  Modal,
  Platform,
  Keyboard,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useTheme } from "../../../contexts/theme-context";
import { SubHeader } from "@/components/sub-header";
import { PostComponent } from "@/components/post-section";
import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import { useBalance, useWallet } from "@/hooks";
import {
  formatToSixDecimals,
  formatUSDC,
  formatUSDCAllDecimals,
  parseUSDC,
} from "@/utils/helpers";
import { Loading } from "@/components/loading";
import { useSmartAccount } from "@/contexts/smart-account-context";
import { Button } from "@/components/ui/button";
import { KeyboardAvoidingView } from "react-native";
import { Input } from "@/components/ui/input";
import { colors } from "@/utils/theme";
import { useForm, Controller, set } from "react-hook-form";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";
import { ERC20_ABI } from "@/utils/constants";
import { Address, encodeFunctionData, Chain, Transport } from "viem";
import { SmartAccountClient } from "permissionless";
import { EntryPoint } from "permissionless/types/entrypoint";
import { SmartAccount } from "permissionless/accounts";
import { fetchPublicClient } from "@/hooks/use-public-client";
import { GlayzeToast } from "@/components/ui/glayze-toast";

export default function Wallet() {
  const { theme } = useTheme();
  const ref = useRef(null);
  useScrollToTop(ref);
  const { smartAccountClient } = useSmartAccount();
  const [refreshing, setRefreshing] = useState(false);
  const address = smartAccountClient?.account.address;
  const {
    data: balance,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    refetch: refetchBalance,
  } = useBalance(address);
  const { data: wallet, isLoading, isError } = useWallet(address);
  const [viewTweets, setViewTweets] = useState({
    "Your Investments": false,
    "X Creator Rewards": false,
    "Glayze Creator Rewards": false,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchBalance();
    setRefreshing(false);
  }, [refetchBalance]);

  const toggleViewTweets = useCallback((section) => {
    setViewTweets((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const renderItem = useCallback(
    ({ item, section }) => {
      if (section.type === "balance") {
        return (
          <View className="flex flex-row justify-between py-2">
            <Text className="text-sm" style={{ color: theme.textColor }}>
              {item.title}
            </Text>
            <Text className="text-sm" style={{ color: theme.textColor }}>
              {item.value}
            </Text>
          </View>
        );
      } else if (section.type === "investment") {
        return (
          <PostComponent post={item} viewTweets={viewTweets[section.title]} />
        );
      }
    },
    [theme.textColor, viewTweets]
  );

  const sections = [
    {
      type: "header",
      data: [{}],
      renderItem: () => (
        <View className="items-center py-8 space-y-4">
          <View className="space-y-4">
            <View>
              <Text
                className="text-xl text-center"
                style={{ color: theme.mutedForegroundColor }}
              >
                Your Balance
              </Text>
              <Text
                className="text-5xl text-center pt-6 font-bold"
                style={{ color: theme.textColor }}
              >
                ${formatUSDC(balance ?? "0")}
              </Text>
            </View>
            <SendReceiveButtons
              balance={balance}
              address={address}
              smartAccountClient={smartAccountClient}
              refetch={refetchBalance}
            />
          </View>
        </View>
      ),
    },
    // {
    //   type: "balance",
    //   title: "Total Investments",
    //   data: [
    //     { title: "Individual Value", value: "$1000" },
    //     { title: "Your Investments", value: "$1000" },
    //     { title: "X Creator Rewards", value: "$1000" },
    //     { title: "Glayze Creator Rewards", value: "$1000" },
    //   ],
    // },
    {
      type: "investment",
      title: "Investments",
      data: wallet?.holdings || [],
    },
    {
      type: "investment",
      title: "X Posts",
      data: wallet?.xPosts || [],
    },
    {
      type: "investment",
      title: "Creations",
      data: wallet?.creations || [],
    },
  ];

  if (isLoading || isError || isBalanceError) {
    return <Loading error={isError ? "Error loading data" : null} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <GlayzeToast />
      <SectionList
        className="p-6"
        contentContainerStyle={{
          paddingBottom: 80, // Adjust this value based on your tab bar height
          paddingTop: 24, // Add some top padding as well
        }}
        ref={ref}
        sections={sections}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false} // Disable sticky headers by default
        renderSectionHeader={({ section }) => {
          if (section.type === "balance" || section.type === "investment") {
            return (
              <View className="flex flex-row justify-between items-center pt-6">
                <SubHeader title={section.title} />
                {section.type === "investment" && (
                  <TouchableOpacity
                    onPress={() => toggleViewTweets(section.title)}
                  >
                    <Text style={{ color: theme.tintColor }}>
                      {viewTweets[section.title] ? "Hide Posts" : "Show Posts"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }
          return null;
        }}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textColor}
          />
        }
      />
    </SafeAreaView>
  );
}

type SendReceiveButtonsProps = {
  balance: string | undefined | null;
  address: string | undefined | null;
  smartAccountClient: SmartAccountClient<
    EntryPoint,
    Transport,
    Chain,
    SmartAccount<EntryPoint, string, Transport, Chain>
  > | null;
  refetch: () => void;
};
interface FormInput {
  amount: string;
  recipient: string;
}

function SendReceiveButtons({
  balance,
  address,
  smartAccountClient,
  refetch,
}: SendReceiveButtonsProps) {
  const publicClient = fetchPublicClient();
  const { theme, themeName } = useTheme();
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormInput>({
    defaultValues: {
      amount: "",
      recipient: "",
    },
  });

  const watchAmount = watch("amount");
  const hasSufficientBalance =
    Number(parseUSDC(watchAmount)) <= Number(balance);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const copyToClipboard = async () => {
    console.log("Copying to clipboard");
    try {
      if (!address) throw new Error("Error copying to clipboard");
      await Clipboard.setStringAsync(address);
      Toast.show({
        text1: "Copied to clipboard",
        text2: "Address copied to clipboard",
        type: "success",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Error copying to clipboard",
        text2: "Please try again",
        type: "error",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    }
  };

  const handleSend = async (data: FormInput) => {
    setIsLoading(true);
    try {
      if (!smartAccountClient) throw new Error("No smart account client found");
      const { amount, recipient } = data;
      console.log("Sending", amount, "to", recipient);
      setSendModalVisible(false);
      const txHash = await smartAccountClient?.sendTransaction({
        to: process.env.EXPO_PUBLIC_USDC_ADDRESS! as Address,
        data: encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [recipient as Address, BigInt(parseUSDC(amount))],
        }),
        value: 0n,
      });
      console.log("✅ Transaction successfully sponsored!");
      console.log(
        `🔍 View on Blockscout: https://base-sepolia.blockscout.com/tx/${txHash}`
      );
      const txReceipt = await publicClient?.waitForTransactionReceipt({
        hash: txHash as Address,
      });

      if (!txReceipt) throw new Error("Transaction receipt is undefined");
      refetch();
      Toast.show({
        text1: "Transaction sent successfully",
        type: "success",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    } catch (error) {
      console.error("Error sending:", error);
      Toast.show({
        text1: "Error sending transaction",
        text2: "Please try again",
        type: "error",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View className="flex flex-row justify-center items-end space-x-12 mt-4">
        <TouchableOpacity onPress={() => setSendModalVisible(true)}>
          <View className="flex flex-col items-center">
            <View className="h-8 flex items-end justify-end">
              <Image
                source={
                  themeName === "dark"
                    ? require("@/assets/images/dark/send.png")
                    : require("@/assets/images/light/send.png")
                }
                className="w-7 h-7"
              />
            </View>
            <Text className="text-lg mt-2" style={{ color: theme.textColor }}>
              Send
            </Text>
          </View>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={sendModalVisible}
          onRequestClose={() => setSendModalVisible(false)}
        >
          <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                isKeyboardVisible
                  ? Keyboard.dismiss()
                  : setSendModalVisible(false)
              }
              className="flex-1 justify-end bg-black/50"
            >
              <View
                style={{ backgroundColor: theme.backgroundColor }}
                className="rounded-t-3xl p-6 h-[375px]"
              >
                <Text
                  style={{ color: theme.textColor }}
                  className="text-2xl font-medium text-center"
                >
                  Send
                </Text>
                <Text
                  className="pt-1 pb-2"
                  style={{ color: theme.mutedForegroundColor }}
                >
                  Balance: ${formatUSDCAllDecimals(balance ?? "0")}
                </Text>

                <View className="flex-row items-center justify-between mb-4">
                  <View className="w-2/3">
                    <Controller
                      control={control}
                      rules={{
                        required: "Amount is required",
                        validate: (value) => {
                          if (Number(value) <= 0)
                            return "Amount must be greater than 0";
                          if (
                            value.includes(".") &&
                            value.split(".")[1].length > 6
                          ) {
                            return "Maximum 6 decimal places allowed";
                          }
                          return true;
                        },
                      }}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          style={{
                            color: theme.textColor,
                            backgroundColor: theme.secondaryBackgroundColor,
                          }}
                          placeholder={formatUSDCAllDecimals(balance ?? "0")}
                          onChangeText={(text) => {
                            const formattedText = formatToSixDecimals(text);
                            onChange(formattedText);
                          }}
                          value={value}
                          keyboardType="numeric"
                        />
                      )}
                      name="amount"
                    />
                  </View>
                  <TouchableOpacity
                    className="absolute right-32"
                    style={{
                      backgroundColor: theme.backgroundColor,
                      borderColor: theme.mutedForegroundColor,
                    }}
                    onPress={() =>
                      setValue("amount", formatUSDCAllDecimals(balance ?? "0"))
                    }
                  >
                    <Text
                      className="text-sm"
                      style={{ color: theme.textColor }}
                    >
                      MAX
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.amount && (
                  <Text style={{ color: "red" }}>{errors.amount.message}</Text>
                )}

                <Text
                  className="pt-1 pb-1"
                  style={{ color: theme.mutedForegroundColor }}
                >
                  To
                </Text>

                <View className="flex-row items-center justify-between mb-4">
                  <View className="w-full">
                    <Controller
                      control={control}
                      rules={{
                        required: "Recipient address is required",
                        pattern: {
                          value: /^0x[a-fA-F0-9]{40}$/,
                          message: "Invalid Ethereum address",
                        },
                      }}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          style={{
                            color: theme.textColor,
                            backgroundColor: theme.secondaryBackgroundColor,
                          }}
                          placeholder={"0x..."}
                          onChangeText={onChange}
                          value={value}
                          keyboardType="default"
                        />
                      )}
                      name="recipient"
                    />
                  </View>
                </View>
                {errors.recipient && (
                  <Text style={{ color: "red" }}>
                    {errors.recipient.message}
                  </Text>
                )}

                <View className="mt-auto mb-8">
                  <Button
                    buttonStyle="w-full rounded-full"
                    onPress={handleSubmit(handleSend)}
                    disabled={
                      !hasSufficientBalance ||
                      Number(watchAmount) === 0 ||
                      Object.keys(errors).length > 0
                    }
                    style={{
                      backgroundColor:
                        !hasSufficientBalance ||
                        Number(watchAmount) === 0 ||
                        Object.keys(errors).length > 0
                          ? theme.mutedForegroundColor
                          : theme.tabBarActiveTintColor,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {!isLoading ? (
                        <Text
                          className="text-center py-3 font-semibold text-lg"
                          style={{ color: colors.white }}
                        >
                          {!hasSufficientBalance
                            ? "Insufficient Balance"
                            : watchAmount === ""
                            ? "Must send more than $0"
                            : `Send $${watchAmount}`}
                        </Text>
                      ) : (
                        <ActivityIndicator
                          size="small"
                          color={colors.white}
                          className="py-4"
                        />
                      )}
                    </View>
                  </Button>
                </View>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
        <TouchableOpacity onPress={() => setReceiveModalVisible(true)}>
          <View className="flex flex-col items-center">
            <View className="h-8 flex items-end justify-end">
              <Image
                source={
                  themeName === "dark"
                    ? require("@/assets/images/dark/receive.png")
                    : require("@/assets/images/light/receive.png")
                }
                className="w-8 h-8"
              />
            </View>
            <Text className="text-lg mt-2" style={{ color: theme.textColor }}>
              Receive
            </Text>
          </View>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={receiveModalVisible}
          onRequestClose={() => setReceiveModalVisible(false)}
        >
          <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                isKeyboardVisible
                  ? Keyboard.dismiss()
                  : setReceiveModalVisible(false)
              }
              className="flex-1 justify-end bg-black/50"
            >
              <View
                style={{ backgroundColor: theme.backgroundColor }}
                className="rounded-t-3xl p-6 h-[300px]"
              >
                <Text
                  style={{ color: theme.textColor }}
                  className="text-2xl font-medium text-center"
                >
                  Receive
                </Text>
                <Text
                  className="font-medium py-2"
                  style={{ color: theme.textColor }}
                >
                  Your Address
                </Text>
                <Input placeholder={address ?? ""} readOnly />
                <Text
                  className="font-semibold pb-2 pt-6"
                  style={{ color: theme.textColor }}
                >
                  WARNING! Only send on USDC on Base
                </Text>
                <Button
                  buttonStyle="w-full rounded-lg"
                  onPress={copyToClipboard}
                  style={{ backgroundColor: theme.tabBarActiveTintColor }}
                >
                  <Text
                    className="text-center py-4 font-bold"
                    style={{ color: colors.white }}
                  >
                    Copy Address
                  </Text>
                </Button>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </>
  );
}
