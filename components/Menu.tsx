import { View, Text } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Route } from "../types/types";

type MenuProps = {
  routes: Route[];
  search?: true;
};

export const Menu = ({ routes, search }: MenuProps) => {
  return (
    <View
      className={search ? "w-full px-6 space-y-2" : "w-full space-y-4 px-6"}
    >
      {routes.map((route, i) => (
        <View
          key={i}
          className="flex-row justify-between items-center w-full py-2"
        >
          <Link href={route.href} className="flex-1">
            <Text className={"text-white text-lg opacity-80"}>
              {route.name}
            </Text>
          </Link>
          <Image
            source={
              search
                ? require("@/assets/images/search-arrow.png")
                : require("@/assets/images/forward-arrow.png")
            }
            className="w-4 h-4"
          />
        </View>
      ))}
    </View>
  );
};
