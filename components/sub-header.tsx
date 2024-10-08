import { useTheme } from "@/contexts/theme-context";
import { Text } from "react-native";

type SubHeaderProps = {
  title: string | undefined;
};

export const SubHeader = ({ title }: SubHeaderProps) => {
  const { theme } = useTheme();
  return (
    <Text style={{ color: theme.textColor }} className="text-xl font-bold">
      {title ?? ""}
    </Text>
  );
};
