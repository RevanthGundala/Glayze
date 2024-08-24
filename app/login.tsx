import React from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { ProgressBar } from "@/components/ui/progress-bar";
import { colors } from "@/utils/theme";
import { useTheme } from "@/contexts/theme-context";
import { useLoginWithEmail } from "@privy-io/expo";
import { GlayzeToast } from "@/components/ui/glayze-toast";
import { useForm, Controller } from "react-hook-form";

interface FormInput {
  email: string;
}

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    defaultValues: {
      email: "",
    },
  });

  const { sendCode } = useLoginWithEmail({
    onSendCodeSuccess({ email }) {
      router.push(("/confirm-email?email=" + email) as Href<string>);
    },
    onError(error) {
      console.log(error);
      Toast.show({
        text1: "Error sending email",
        text2: "Please try again",
        type: "error",
      });
    },
  });

  const onSubmit = (data: FormInput) => {
    sendCode({ email: data.email });
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
                <Text className="text-lg" style={{ color: theme.textColor }}>
                  Email
                </Text>
                <Controller
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Your Email"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="email"
                />
                {errors.email && (
                  <Text style={{ color: "red" }}>{errors.email.message}</Text>
                )}
              </View>
              <View>
                <Button
                  buttonStyle="w-full rounded-full py-3"
                  style={{
                    backgroundColor: theme.tabBarActiveTintColor,
                  }}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{
                      color: colors.white,
                    }}
                  >
                    Continue
                  </Text>
                </Button>
              </View>
              <View className="pt-8">
                <ProgressBar sections={3} currentSection={1} />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
