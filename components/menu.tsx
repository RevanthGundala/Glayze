import { View, Text } from "react-native";
import { Image } from "expo-image";
import { Href, Link } from "expo-router";
import { Route } from "../utils/types";
import { useTheme } from "@/contexts/theme-context";

type MenuProps = {
  routes: Route[];
  search?: true;
};

export const Menu = ({ routes, search }: MenuProps) => {
  const { themeName, theme } = useTheme();

  const getIcon = () => {
    if (search) {
      if (themeName === "dark") {
        return require("@/assets/images/dark/search-arrow.png");
      } else {
        return require("@/assets/images/light/search-arrow.png");
      }
    } else {
      if (themeName === "dark") {
        return require("@/assets/images/dark/forward-arrow.png");
      } else {
        return require("@/assets/images/light/forward-arrow.png");
      }
    }
  };

  return (
    <View
      className={search ? "w-full px-6 space-y-2" : "w-full space-y-4 px-6"}
    >
      {routes.map((route, i) => (
        <View
          key={i}
          className="flex-row justify-between items-center w-full py-2"
        >
          <Link href={route.href as Href} className="flex-1">
            <Text className={"text-lg"} style={{ color: theme.textColor }}>
              {route.name}
            </Text>
          </Link>
          <Image source={getIcon()} className="w-4 h-4" />
        </View>
      ))}
    </View>
  );
};
