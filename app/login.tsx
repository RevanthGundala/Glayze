import { ProgressBar } from "@/components/ui/ProgressBar";
import { View, Text } from "react-native";
import { BackArrow } from "@/components/ui/BackArrow";
import { SafeAreaView } from "react-native";

export default function Login() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <BackArrow />  
      <View className="flex-1 justify-center items-center">
        <Text>Login</Text>
      </View>
      <ProgressBar sections={3} currentSection={1} />
    </SafeAreaView>
  );
}   