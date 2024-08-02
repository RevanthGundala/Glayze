import { View } from "react-native";
import { useTheme } from "@/contexts/theme-context";

type ProgressBarProps = {
  sections: number;
  currentSection: number;
};

export const ProgressBar = ({ sections, currentSection }: ProgressBarProps) => {
  const { theme } = useTheme();
  return (
    <View className="mt-4 flex flex-row space-x-2 justify-center items-center">
      {Array.from({ length: sections }).map((_, index) =>
        currentSection === index ? (
          <View
            key={index}
            className="h-2 w-14 rounded-full"
            style={{ backgroundColor: theme.tabBarActiveTintColor }}
          />
        ) : (
          <View
            key={index}
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: theme.tabBarInactiveTintColor }}
          />
        )
      )}
    </View>
  );
};
