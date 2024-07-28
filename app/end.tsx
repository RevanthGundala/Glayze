import { SafeAreaView, View, Text } from "react-native";
import { BackArrow } from "@/components/ui/BackArrow";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function End() {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.log("error", userError);
      } else {
        const id = userData.user?.id;
        const { data: userInfo, error: userInfoError } = await supabase
          .from("Users")
          .select("*")
          .eq("id", id);
        if (userInfoError) {
          console.log("error", userInfoError);
        } else {
          setName(userInfo[0].name);
          setHandle(userInfo[0].handle);
          setProfilePicture(userInfo[0].profile_pic);
        }
      }
    }
    fetchUser();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mt-16 space-y-4 items-center">
        <Text className="w-[250px] text-3xl font-semibold text-white text-center">
          You're ready to start trading!
        </Text>
        <View className="items-center py-8 space-y-4">
          <Image source={{ uri: profilePicture }} className="w-16 h-16" />
          <View className="pb-8 space-y-1 items-center">
            <Text className="text-white text-2xl font-semibold">{name}</Text>
            <Text className="text-white text-lg opacity-80">{handle}</Text>
          </View>
          <Button
            buttonStyle={
              "flex flex-row justify-center items-center bg-primary rounded-full w-[300px]"
            }
            onPress={() => router.push("/(authenticated)/home")}
          >
            <Text className="text-black text-lg font-medium py-3">
              Start Trading
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
