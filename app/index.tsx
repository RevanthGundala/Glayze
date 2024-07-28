import React from "react";
import { Text, SafeAreaView, View, TextInput } from "react-native";
import { Image } from "expo-image";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { useState } from "react";

import { useLoginWithSMS } from "@privy-io/expo";

export default function Index() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("480-939-9877");
  const { state, sendCode, loginWithCode } = useLoginWithSMS({
    onError: (error) => {
      console.log("Error", error);
    },
  });

  return (
    <SafeAreaView className="flex-1">
      {/* <View className="pt-6">
      <Image source={require("@/assets/images/iphone.png")} className="w-full h-full" />
      </View> */}

      <View className="space-y-2">
        <Text className="text-white text-center text-2xl font-semibold">
          Welcome to Glayze!
        </Text>
        <Text className="text-white opacity-70 text-center text-sm">
          The ultimate app for trading tweets.
        </Text>
      </View>
      <ProgressBar sections={3} currentSection={0} />
      <View className="flex flex-row justify-center items-center pt-12">
        <Button
          buttonStyle={
            "flex flex-row justify-center items-center bg-primary rounded-full"
          }
          onPress={() => router.push("/connect")}
        >
          <Text className="text-black font-medium px-8 py-4">Get Started</Text>
        </Button>
      </View>
      <View>
        <TextInput onChangeText={setPhone} />
        <Pressable
          // Keeps button disabled while code is being sent
          disabled={state.status === "sending-code"}
          onPress={async () => {
            console.log("Sending code");
            const { success } = await sendCode({ phone });
            console.log("Success", success);
          }}
        >
          <Text>Send Code</Text>
        </Pressable>

        {state.status === "sending-code" && (
          //  Shows only while the code is sending
          <Text>Sending Code...</Text>
        )}
      </View>

      <View>
        <TextInput onChangeText={setCode} />
        <Pressable
          // Keeps button disabled until the code has been sent
          disabled={state.status !== "awaiting-code-input"}
          onPress={() => loginWithCode({ code })}
        >
          <Text>Login</Text>
        </Pressable>
      </View>

      {state.status === "submitting-code" && (
        // Shows only while the login is being attempted
        <Text>Logging in...</Text>
      )}
    </SafeAreaView>
  );
}
