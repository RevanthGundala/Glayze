import { useTheme } from "../contexts/theme-context";
import { ActivityIndicator, View, SafeAreaView, Text } from "react-native";
import { Header } from "@/components/header";

type LoadingProps = {
  error?: string | null;
  showHeader?: boolean;
};

export const Loading = ({ error, showHeader = true }: LoadingProps) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {showHeader && (
        <View className="flex flex-row">
          <Header backArrow />
        </View>
      )}
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
