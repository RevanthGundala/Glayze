import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/theme-context";
import { ActivityIndicator } from "react-native";

export const Loading = () => {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <ActivityIndicator size={"large"} />
    </SafeAreaView>
  );
};
