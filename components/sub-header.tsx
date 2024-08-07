import { useTheme } from "@/contexts/theme-context";
import { Text } from "react-native";

type SubHeaderProps = {
  title: string | undefined;
};

export const SubHeader = ({ title }: SubHeaderProps) => {
  const { theme } = useTheme();
  return (
    <Text
      style={{ color: theme.textColor, fontWeight: theme.boldFont }}
      className="text-xl"
    >
      {title ?? ""}
    </Text>
  );
};
