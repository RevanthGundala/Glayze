import { useTheme } from "../contexts/theme-context";
import { ActivityIndicator, View, SafeAreaView, Text } from "react-native";
import { Header } from "@/components/header";

type LoadingProps = {
  error?: string | null;
};

export const Loading = ({ error }: LoadingProps) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex flex-row">
        <Header backArrow />
      </View>
      <View className="flex-1 justify-center items-center mb-32">
        {error ? (
          <Text style={{ color: theme.textColor }}>{error}</Text>
        ) : (
          <ActivityIndicator size="large" color={theme.textColor} />
        )}
      </View>
    </SafeAreaView>
  );
};
