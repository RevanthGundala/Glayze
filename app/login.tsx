import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Header } from "@/components/header";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useTheme } from "@/contexts/theme-context";
import { useLoginWithSms } from "@privy-io/react-auth";
import { GlayzeToast } from "@/components/ui/glayze-toast";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const CELL_COUNT = 11;

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const { sendCode } = useLoginWithSms();

  useEffect(() => {
    try {
      if (value.length === CELL_COUNT) {
        const formattedPhone = `+${value.slice(0, 1)} ${value.slice(
          1,
          4
        )} ${value.slice(4, 7)} ${value.slice(7)}`;

        sendCode({ phoneNumber: formattedPhone });
        router.push(("/confirm-phone?phone=" + formattedPhone) as Href<string>);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: "Error sending code",
        text2: "Please try again",
        type: "error",
      });
    }
  }, [value]);

  const renderCell = ({ index, symbol, isFocused }) => {
    let cellWidth = "w-[22px]";
    if (index === 0) cellWidth = "w-[12px]";
    const isHyphen = index === 1 || index === 4 || index === 7;

    const placeholderDigit =
      index === 0 ? "1" : index > 7 ? "5" : ((index - 1) % 3) + 1;

    return (
      <React.Fragment key={index}>
        {isHyphen && (
          <View className="w-[15px] items-center justify-center">
            <Text style={{ color: theme.mutedForegroundColor }}>-</Text>
          </View>
        )}
        <View
          onLayout={getCellOnLayoutHandler(index)}
          className={`${cellWidth} h-[40px] justify-end items-center mr-1`}
        >
          <Text
            className="text-[24px] mb-1"
            style={{
              color: symbol ? theme.textColor : theme.mutedForegroundColor,
            }}
          >
            {symbol || (isFocused ? <Cursor /> : placeholderDigit)}
          </Text>
          <View
            className="w-full h-[2px]"
            style={{
              backgroundColor: isFocused
                ? theme.tabBarActiveTintColor
                : theme.mutedForegroundColor,
            }}
          />
        </View>
      </React.Fragment>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <GlayzeToast />
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <KeyboardAvoidingView behavior={"padding"} className="flex-1">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
            <View className="space-y-4">
              <View className="flex flex-row justify-center items-center px-6 pb-6">
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View>
                <Text
                  className="text-lg mb-6 text-center"
                  style={{ color: theme.textColor }}
                >
                  Enter your phone number
                </Text>
                <CodeField
                  ref={ref}
                  {...props}
                  value={value}
                  onChangeText={setValue}
                  cellCount={CELL_COUNT}
                  keyboardType="number-pad"
                  textContentType="telephoneNumber"
                  renderCell={renderCell}
                />
              </View>
              <View className="pt-8">
                <ProgressBar sections={3} currentSection={0} />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
