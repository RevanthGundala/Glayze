import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Text,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { Header } from "@/components/header";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import { useTheme } from "@/contexts/theme-context";
import { useLoginWithSMS, usePrivy } from "@privy-io/expo";
import { GlayzeToast } from "@/components/ui/glayze-toast";
import {
  create,
  open,
  dismissLink,
  LinkSuccess,
  LinkExit,
  LinkIOSPresentationStyle,
  LinkLogLevel,
  LinkTokenConfiguration,
} from "react-native-plaid-link-sdk";
import { Loading } from "@/components/loading";
import { upsertUser } from "@/utils/api-calls";
import { useSmartAccount } from "@/contexts/smart-account-context";

const CODE_LENGTH = 6;

export default function ConfirmPhone() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const [value, setValue] = useState("");
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { smartAccountClient } = useSmartAccount();
  const address = smartAccountClient?.account.address;

  const ref = useBlurOnFulfill({ value, cellCount: CODE_LENGTH });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleAuthenticate = async (id: string | undefined) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/plaid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_user_id: id,
            phone_number: phone as string,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to create link token");
      const data = await response.json();
      create({ token: data.linkToken });
    } catch (error) {
      console.log(error);
      throw error;
    }
    open({
      onSuccess: async (success: LinkSuccess) => {
        console.log(success);
        // TODO: Exchange public token
        await upsertUser(id, {
          address: smartAccountClient?.account.address,
          referralCode: address,
        });
        router.push("/connect-to-twitter");
      },
      onExit: async (linkExit: LinkExit) => {
        console.log(linkExit);
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/supabase/users`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              privyId: id,
            }),
          }
        );

        Toast.show({
          text1: "Error authenticating",
          text2: "Please try again",
          type: "error",
        });
      },
      iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
      logLevel: LinkLogLevel.ERROR,
    });
    setIsLoading(false);
  };

  const { loginWithCode } = useLoginWithSMS({
    onLoginSuccess(user, isNewUser) {
      console.log(user, isNewUser);
      isNewUser
        ? handleAuthenticate(user.id)
        : router.push("/(authenticated)/(tabs)/home");
    },
    onError(error) {
      console.log(error);
      Toast.show({
        text1: "Error verifying code",
        text2: "Please try again",
        type: "error",
        autoHide: true,
      });
    },
  });

  useEffect(() => {
    if (value.length === CODE_LENGTH) {
      loginWithCode({
        code: value,
        phone: phone as string,
      });
    }
  }, [value]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <GlayzeToast />
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <View className="flex flex-row justify-center items-center pt-12 px-6">
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>
      <View className="flex flex-row justify-center items-center pt-12 px-6 pb-6">
        <Text className="text-center" style={{ color: theme.textColor }}>
          A code was sent to <Text className="font-bold">{phone}</Text>. Please
          enter the code below to continue.
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              className="px-6 py-2"
            >
              {!isLoading ? (
                <CodeField
                  ref={ref}
                  {...props}
                  value={value}
                  onChangeText={setValue}
                  cellCount={CODE_LENGTH}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete={Platform.select({
                    android: "sms-otp",
                    default: "one-time-code",
                  })}
                  renderCell={({ index, symbol, isFocused }) => (
                    <View
                      key={index}
                      onLayout={getCellOnLayoutHandler(index)}
                      className={`w-12 h-12 justify-center items-center rounded-lg border`}
                      style={{
                        backgroundColor: theme.backgroundColor,
                        borderColor: theme.mutedForegroundColor,
                      }}
                    >
                      <Text
                        className="text-2xl text-center"
                        style={{ color: theme.textColor }}
                      >
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </View>
                  )}
                />
              ) : (
                <Loading showHeader={false} />
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
