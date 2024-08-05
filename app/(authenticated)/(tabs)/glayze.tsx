import { Input } from "@/components/ui/input";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { CONTRACT_ADDRESS, CREATE_POST_PRODUCT_ID } from "@/utils/constants";
import { useRouter } from "expo-router";
import { encodeFunctionData, parseAbi } from "viem";
import { PaymasterMode } from "@biconomy/account";
import abi from "../../../abi.json";
import { ScrollView } from "react-native";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { DEPLOYMENT_FEE } from "@/utils/constants";
import { Header } from "@/components/header";
// import { useProduct } from "@/hooks";
// import Purchases from "react-native-purchases";
import { useRef } from "react";
import { colors } from "@/utils/theme";

export default function Glayze() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [auraAmount, setAuraAmount] = useState(0);
  // const {
  //   data: product,
  //   isLoading,
  //   isError,
  // } = useProduct(CREATE_POST_PRODUCT_ID);

  const handlePurchase = async () => {
    // if (!product) {
    //   console.log("Error", "Product not available for purchase.");
    //   return;
    // }
  };

  const handleAuraPurchase = async () => {
    console.log("Aura purchase");
  };

  //   try {
  //     const { customerInfo } = await Purchases.purchaseStoreProduct(product);
  //     if (
  //       typeof customerInfo.entitlements.active["my_entitlement_identifier"] !==
  //       "undefined"
  //     ) {
  //       console.log("Success", "Purchase successful!");
  //       // Here you can proceed with creating the post using smart contract
  //       // createPost();
  //     } else {
  //       console.log(
  //         "Error",
  //         "Purchase completed, but entitlement not found. Please contact support."
  //       );
  //     }
  //   } catch (e: any) {
  //     if (!e.userCancelled) {
  //       console.error("Purchase error:", e);
  //       console.log("Error", "An error occurred during purchase.");
  //     }
  //   }
  // }, [product]);
  // if (!smartAccount) console.log("No smart account");
  // const encodedCall = encodeFunctionData({
  //   abi,
  //   functionName: "createPost",
  //   args: [name, symbol, url],
  // });
  // const tx = {
  //   to: CONTRACT_ADDRESS,
  //   data: encodedCall,
  // };
  // const amountInWei = await smartAccount?.getGasEstimate([tx, tx], {
  //   paymasterServiceData: {
  //     mode: PaymasterMode.SPONSORED,
  //   },
  // });
  // console.log(amountInWei?.toString());

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="px-6 py-2"
          >
            <Header title="Ready to Glayze?" />
            <View className="space-y-6 mt-8">
              <View>
                <Text className="text-lg" style={{ color: theme.textColor }}>
                  Name
                </Text>
                <Input
                  placeholder="ELON"
                  value={name}
                  onChangeText={setName}
                  style={{
                    color: theme.textColor,
                    backgroundColor: theme.secondaryBackgroundColor,
                  }}
                />
              </View>
              <View>
                <Text className="text-lg" style={{ color: theme.textColor }}>
                  Ticker Symbol
                </Text>
                <Input
                  placeholder="$ELON"
                  value={symbol}
                  onChangeText={setSymbol}
                  style={{
                    color: theme.textColor,
                    backgroundColor: theme.secondaryBackgroundColor,
                  }}
                />
              </View>
              <Text className="text-lg" style={{ color: theme.textColor }}>
                URL
              </Text>
              <Input
                placeholder="https://x.com/ElonMusk/123213"
                value={url}
                onChangeText={setUrl}
                style={{
                  color: theme.textColor,
                  backgroundColor: theme.secondaryBackgroundColor,
                }}
              />
            </View>
            <PaymentDetails />
            <Button
              buttonStyle="w-full rounded-lg my-4"
              style={{ backgroundColor: theme.tintColor }}
              onPress={() => setModalVisible(true)}
            >
              <Text
                className="text-center font-semibold py-4"
                style={{ color: theme.tintTextColor }}
              >
                Pay $1.09
              </Text>
            </Button>
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
                    Use your $AURA
                  </Text>
                  <Text
                    style={{ color: theme.mutedForegroundColor }}
                    className="text-center py-4"
                  >
                    Use $AURA to pay for transaction fees.
                  </Text>
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-1 mr-2">
                      <Input
                        style={{
                          color: theme.textColor,
                          backgroundColor: theme.secondaryBackgroundColor,
                        }}
                        placeholder={"5"}
                        value={auraAmount.toString()}
                        onChangeText={(text) => setAuraAmount(Number(text))}
                      />
                    </View>
                    <TouchableOpacity
                      className="absolute right-4 transform -translate-y-1/2 rounded-full py-2 px-3 border"
                      style={{
                        backgroundColor: theme.backgroundColor,
                        borderColor: theme.mutedForegroundColor,
                      }}
                      onPress={() => setAuraAmount(0)}
                    >
                      <Text
                        className="text-sm"
                        style={{ color: theme.textColor }}
                      >
                        MAX
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row justify-between">
                    <Button
                      onPress={() => setModalVisible(false)}
                      buttonStyle="flex-1 py-3 rounded-lg mr-2"
                      style={{ backgroundColor: theme.tabBarInactiveTintColor }}
                    >
                      <Text
                        style={{ color: colors.white }}
                        className="text-center"
                      >
                        Back
                      </Text>
                    </Button>
                    <Button
                      onPress={handlePurchase}
                      buttonStyle="py-3 flex-1 rounded-lg ml-2"
                      style={{ backgroundColor: theme.tintColor }}
                    >
                      <Text
                        style={{ color: colors.white }}
                        className="font-semibold text-center"
                      >
                        Apply $AURA
                      </Text>
                    </Button>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PaymentDetails = () => {
  const { theme } = useTheme();
  return (
    <View className="mt-8 space-y-4">
      <Text className="text-xl" style={{ color: theme.textColor }}>
        Payment Details
      </Text>
      <View className="flex-row justify-between items-center">
        <Text style={{ color: theme.mutedForegroundColor }}>Deployment</Text>
        <Text style={{ color: theme.textColor }}>${DEPLOYMENT_FEE}</Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text style={{ color: theme.mutedForegroundColor }}>Fee</Text>
        <Text style={{ color: theme.textColor }}>$0.09</Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text style={{ color: theme.mutedForegroundColor }}>Total</Text>
        <Text style={{ color: theme.textColor }}>$1.09</Text>
      </View>
    </View>
  );
};
