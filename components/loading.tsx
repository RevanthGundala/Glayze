import { useTheme } from "../contexts/theme-context";
import { ActivityIndicator, View, SafeAreaView, Text } from "react-native";

type LoadingProps = {
  error: string | null;
};
export const Loading = ({ error }: LoadingProps) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="flex flex-row justify-center items-center">
        {error ? (
          <Text style={{ color: theme.textColor }}>{error}</Text>
        ) : (
          <ActivityIndicator size={"large"} />
        )}
      </View>
    </SafeAreaView>
  );
};
