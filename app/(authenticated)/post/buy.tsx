import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, Href } from "expo-router";
import { useTheme } from "@/contexts/theme-context";
import { colors } from "@/utils/theme";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { ShareHeader } from "@/components/share-header";
import { useLocalSearchParams } from "expo-router";
import {
  useShares,
  useBalance,
  useBuyPrice,
  useAura,
  useReferral,
} from "@/hooks";
import { Loading } from "@/components/loading";
import { ABI, ERC20_ABI } from "@/utils/constants";
import { Address, encodeFunctionData } from "viem";
import { formatUSDC, parseUSDC } from "@/utils/helpers";
import { getUser, insertTrade } from "@/utils/api-calls";
import { useSmartAccount } from "@/contexts/smart-account-context";
import { fetchPublicClient } from "@/hooks/use-public-client";
import { Controller, useForm } from "react-hook-form";

export default function Buy() {
  const maxFontSize = 48;
  const minFontSize = 12;
  const [amount, setAmount] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const { id, name, symbol, image } = useLocalSearchParams();
  const { smartAccountClient, error: smartAccountError } = useSmartAccount();
  const address = smartAccountClient?.account.address;
  const { data: referrals } = useReferral(address);
  type FormData = {
    auraAmount: string;
  };
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      auraAmount: "",
    },
  });
  const [localAuraAmount, setLocalAuraAmount] = useState("0");
  const {
    data: balance,
    isLoading: balanceLoading,
    isError: balanceError,
  } = useBalance(address);
  const {
    data: shares,
    isLoading: sharesLoading,
    isError: sharesError,
  } = useShares(address, id as string);
  const {
    data: buyPriceData,
    isLoading: buyPriceLoading,
    isError: buyPriceError,
  } = useBuyPrice(id as string, amount, localAuraAmount);
  const {
    data: aura,
    isLoading: auraLoading,
    isError: auraError,
  } = useAura(address);
  const publicClient = fetchPublicClient();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [hasSufficientBalance, setHasSufficientBalance] = useState(true);
  const [hasSufficientAura, setHasSufficientAura] = useState(true);
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [fontSize, setFontSize] = useState(maxFontSize);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    setHasSufficientBalance(
      Number(balance) >= Number(buyPriceData?.buyPriceAfterFees)
    );
    setHasSufficientAura(Number(aura) >= Number(localAuraAmount));
  }, [
    balance,
    buyPriceData,
    buyPriceLoading,
    balanceLoading,
    aura,
    auraLoading,
    localAuraAmount,
  ]);

  const updateAmount = (value: string) => {
    if (!balance) {
      return;
    } else if (amount === "0" && value !== ".") {
      setAmount(value);
    } else {
      setAmount((prev) => prev + value);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

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

  useEffect(() => {
    const length = amount.length;
    let newSize = maxFontSize - length * 1.5;
    newSize = Math.max(newSize, minFontSize);
    setFontSize(newSize);
  }, [amount, maxFontSize, minFontSize]);

  const clearAmount = () => setAmount("0");

  const handleBuy = async (formData: FormData) => {
    let txSuccess = false;
    try {
      if (!publicClient) throw new Error("No public client found.");
      if (!buyPriceData) throw new Error("Buy price data not available");
      if (smartAccountError)
        throw new Error("Error connecting to smart account");
      setModalVisible(false);
      setIsLoading(true);

      const transactions = [
        {
          to: process.env.EXPO_PUBLIC_USDC_ADDRESS! as Address,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: "approve",
            args: [
              process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
              BigInt(buyPriceData?.buyPriceAfterFees),
            ],
          }),
          value: 0n,
        },
        {
          to: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS! as Address,
          data: encodeFunctionData({
            abi: ABI,
            functionName: "buyShares",
            args: [
              BigInt(id as string),
              BigInt(amount),
              BigInt(parseUSDC(localAuraAmount ?? "0")),
            ],
          }),
          value: 0n,
        },
      ];

      const txHash = await smartAccountClient?.sendTransactions({
        transactions,
      });

      console.log("✅ Transaction successfully sponsored!");
      console.log(
        `🔍 View on Blockscout: https://base-sepolia.blockscout.com/tx/${txHash}`
      );

      const txReceipt = await publicClient?.waitForTransactionReceipt({
        hash: txHash as Address,
      });

      if (!txReceipt) throw new Error("Transaction receipt is undefined");
      txSuccess = true;

      const error = await insertTrade(txReceipt);
      if (error) throw error;

      const referrer = referrals?.find((r) => r.referee === address)?.referrer;
      if (referrer) {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/refer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              referrer,
              referee: address,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to submit referral");
        }
      }
      // Now navigate to the success screen
      router.replace(
        `/(authenticated)/aux/success?isBuy=true&shares=${amount}&price=${formatUSDC(
          buyPriceData?.buyPriceAfterFees
        )}&symbol=${symbol}` as Href<string>
      );
    } catch (error) {
      console.error("Error in handleBuy:", error);

      // Close the modal if it's open
      setModalVisible(false);

      // Wait a bit before navigating to the error screen
      setTimeout(() => {
        router.replace(
          `/(authenticated)/aux/error?success=${txSuccess}` as Href<string>
        );
      }, 500);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  const percentages = ["10", "25", "50", "100"];
  const numpad = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "CLEAR",
    "0",
    "X",
  ];

  if (balanceLoading || sharesLoading || auraLoading) {
    return <Loading />;
  }

  if (balanceError || sharesError || auraError) {
    return <Loading error={"Could not load, please contact support"} />;
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex-row items-center justify-between px-4 w-full">
        <Header backArrow />
        <ShareHeader
          name={name as string}
          symbol={symbol as string}
          image={image as string}
        />
        <View className="w-1/5" />
      </View>
      <View className="flex-1 px-4 pt-2">
        <Text
          className="text-3xl font-semibold text-center"
          style={{ color: theme.textColor }}
        >
          Buy
        </Text>
        <Text
          className="text-center text-sm pt-2"
          style={{ color: theme.mutedForegroundColor }}
        >
          {shares?.number ?? "0"} Shares (~$
          {formatUSDC(shares?.value ?? "0")})
        </Text>
        <View className="mt-2 rounded-xl p-4">
          <Text
            className="font-bold text-center"
            style={{ color: theme.textColor, fontSize }}
          >
            {amount}
          </Text>
        </View>

        <View className="flex-row justify-between mt-2 px-4">
          {percentages.map((percent, i) => (
            <Button
              key={i}
              style={{ backgroundColor: theme.tabBarActiveTintColor }}
              buttonStyle="bg-neutral px-5 py-3 rounded-full"
              onPress={() => setAmount(percent)}
            >
              <Text className="font-semibold" style={{ color: colors.white }}>
                {percent}
              </Text>
            </Button>
          ))}
        </View>

        <View className="flex-row flex-wrap justify-between mt-6">
          {numpad.map((num, i) =>
            num === "X" ? (
              <TouchableOpacity
                key={i}
                onPress={() =>
                  setAmount((prev) =>
                    prev.slice(0, -1) === "" ? "0" : prev.slice(0, -1)
                  )
                }
                className="w-[30%] aspect-square items-center justify-center mb-4"
              >
                <Image
                  source={
                    themeName === "dark"
                      ? require("@/assets/images/dark/backspace.png")
                      : require("@/assets/images/light/backspace.png")
                  }
                  className="w-12 h-6"
                />
              </TouchableOpacity>
            ) : num === "CLEAR" ? (
              <TouchableOpacity
                key={i}
                onPress={clearAmount}
                className="w-[30%] aspect-square items-center justify-center mb-4"
              >
                <Image
                  source={
                    themeName === "dark"
                      ? require("@/assets/images/dark/clear.png")
                      : require("@/assets/images/light/clear.png")
                  }
                  className="w-9 h-9"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={i}
                onPress={() => updateAmount(num)}
                className="w-[30%] aspect-square items-center justify-center mb-4"
              >
                <Text
                  className="text-2xl font-semibold"
                  style={{ color: theme.textColor }}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
        <View className="mt-auto mb-10">
          <Button
            buttonStyle="w-full rounded-full"
            onPress={openModal}
            disabled={amount === "0" || !hasSufficientBalance}
            style={{
              backgroundColor:
                amount === "0" || !hasSufficientBalance
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
                <>
                  <Text
                    className="text-center py-4 font-semibold text-lg"
                    style={{ color: colors.white }}
                  >
                    {amount === "0"
                      ? "Place an order"
                      : !hasSufficientBalance &&
                        !buyPriceLoading &&
                        buyPriceData
                      ? `Insufficient Balance: $${formatUSDC(
                          buyPriceData?.buyPriceAfterFees
                        )}`
                      : `Buy for ${
                          !buyPriceLoading &&
                          buyPriceData &&
                          buyPriceData?.buyPriceAfterFees === "0"
                            ? "Free"
                            : !buyPriceLoading && buyPriceData
                            ? `$${formatUSDC(buyPriceData?.buyPriceAfterFees)}`
                            : ""
                        }`}
                  </Text>
                  {buyPriceLoading && (
                    <ActivityIndicator
                      size="small"
                      color={colors.white}
                      style={{ marginLeft: 10 }}
                    />
                  )}
                </>
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                isKeyboardVisible ? Keyboard.dismiss() : closeModal()
              }
              className="flex-1 justify-end bg-black/50"
            >
              <View
                style={{ backgroundColor: theme.backgroundColor }}
                className="rounded-t-3xl p-6 h-[300px]"
              >
                <Text
                  style={{ color: theme.textColor }}
                  className="text-xl font-medium text-center"
                >
                  Confirm your order
                </Text>
                <Text
                  style={{ color: theme.mutedForegroundColor }}
                  className="py-2 text-center"
                >
                  You are buying {amount ?? "0"} shares of {symbol}
                </Text>

                <Text className="py-2" style={{ color: theme.textColor }}>
                  Balance: {formatUSDC(aura ?? "0")} $AURA
                </Text>

                <View className="flex-row items-center justify-between mb-4">
                  <View className="w-2/3">
                    <Controller
                      control={control}
                      rules={{
                        validate: (value) => {
                          if (value === "") return true;
                          const numValue = Number(value);
                          if (isNaN(numValue))
                            return "Please enter a valid number";
                          if (numValue < 0) return "Amount cannot be negative";
                          if (aura && numValue > Number(aura))
                            return "Amount exceeds balance";
                          return true;
                        },
                      }}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          style={{
                            color: theme.textColor,
                            backgroundColor: theme.secondaryBackgroundColor,
                            borderColor: errors.auraAmount
                              ? "red"
                              : theme.mutedForegroundColor,
                          }}
                          placeholder={formatUSDC(aura ?? "0")}
                          onChangeText={(text) => {
                            onChange(text);
                            setLocalAuraAmount(text === "" ? "0" : text);
                          }}
                          value={value}
                          keyboardType="numeric"
                        />
                      )}
                      name="auraAmount"
                    />
                    {errors.auraAmount && (
                      <Text style={{ color: "red", fontSize: 12 }}>
                        {errors.auraAmount.message}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    className="absolute right-32"
                    style={{
                      backgroundColor: theme.backgroundColor,
                      borderColor: theme.mutedForegroundColor,
                    }}
                    onPress={() => {
                      const maxAmount = formatUSDC(aura ?? "0");
                      setValue("auraAmount", maxAmount);
                      setLocalAuraAmount(maxAmount); // Update local state
                    }}
                  >
                    <Text
                      className="text-sm"
                      style={{ color: theme.textColor }}
                    >
                      MAX
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="mt-auto mb-8">
                  <Button
                    buttonStyle="w-full rounded-full"
                    onPress={handleSubmit(handleBuy)}
                    disabled={
                      amount === "0" ||
                      !hasSufficientBalance ||
                      !hasSufficientAura ||
                      !!errors.auraAmount
                    }
                    style={{
                      backgroundColor:
                        amount === "0" ||
                        !hasSufficientBalance ||
                        !hasSufficientAura ||
                        errors.auraAmount
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
                      <Text
                        className="text-center py-3 font-semibold text-lg"
                        style={{ color: colors.white }}
                      >
                        {!hasSufficientAura && !buyPriceLoading && buyPriceData
                          ? "Not enough $AURA"
                          : `Buy for ${
                              !buyPriceLoading &&
                              buyPriceData &&
                              buyPriceData?.buyPriceAfterFees === "0"
                                ? "Free"
                                : `${
                                    !buyPriceLoading && buyPriceData
                                      ? `$${formatUSDC(
                                          buyPriceData?.buyPriceAfterFees
                                        )}`
                                      : ""
                                  }`
                            }`}
                      </Text>
                      {buyPriceLoading && (
                        <ActivityIndicator
                          size="small"
                          color={colors.white}
                          style={{ marginLeft: 10 }}
                        />
                      )}
                    </View>
                  </Button>
                </View>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
