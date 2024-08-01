import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "react-native";

type SubHeaderProps = {
  title: string;
};

export const SubHeader = ({ title }: SubHeaderProps) => {
  const { theme } = useTheme();
  return (
    <Text
      style={{ color: theme.textColor, fontWeight: theme.boldFont }}
      className="text-2xl"
    >
      {title}
    </Text>
  );
};
