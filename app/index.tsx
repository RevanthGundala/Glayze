import React from "react";
import { Text, SafeAreaView, View, TextInput } from "react-native";
import { Image } from "expo-image";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";
import { useLoginWithPasskey } from "@privy-io/expo/passkey";

export default function Index() {
  const router = useRouter();
  const { state, loginWithPasskey } = useLoginWithPasskey({
    onSuccess(user, isNewUser) {
      // show a toast, send analytics event, etc...
      console.log("User logged in", user);
      if (!isNewUser) {
        router.replace("/(authenticated)/home");
      } else {
        router.push("/connect-to-twitter");
      }
    },
    onError(error) {
      console.log("Error logging in", error);
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
          onPress={() => router.push("/connect-to-twitter")}
        >
          <Text className="text-black font-medium px-8 py-4">Get Started</Text>
        </Button>
        <Button
          // Keeps button disabled until the code has been sent
          onPress={() =>
            loginWithPasskey({
              relyingParty: "https://glayze.app",
            })
          }
        >
          <Text>Login with passkey</Text>
        </Button>

        {state?.status === "submitting-response" && (
          // Shows only while the login is being attempted
          <Text>Logging in...</Text>
        )}

        {state?.status === "error" && (
          <>
            <Text style={{ color: "red" }}>There was an error</Text>
            <Text style={{ color: "lightred" }}>{state?.error?.message}</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
