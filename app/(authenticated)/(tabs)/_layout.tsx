import { Tabs } from "expo-router";
import { Image } from "expo-image";
import { useState, useRef, useEffect, useMemo } from "react";
import { useHomeScrollY } from "@/hooks/use-home-scroll-y";
import { Animated } from "react-native";
import { useTheme } from "@/contexts/theme-context";
import { hexToRgba } from "@/utils/helpers";

const OPAQUE_OPACITY = 1;
const TRANSPARENT_OPACITY = 0.3;

export default function TabLayout() {
  const homeScrollY = useHomeScrollY();
  const [tabBarOpacity] = useState(new Animated.Value(OPAQUE_OPACITY));
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);
  const { theme } = useTheme();

  useEffect(() => {
    const listener = homeScrollY.addListener(({ value }) => {
      scrollVelocity.current = value - lastScrollY.current;
      lastScrollY.current = value;

      if (value <= 0) {
        Animated.timing(tabBarOpacity, {
          toValue: OPAQUE_OPACITY,
          duration: 150,
          useNativeDriver: false,
        }).start();
      } else if (scrollVelocity.current > 0) {
        Animated.timing(tabBarOpacity, {
          toValue: TRANSPARENT_OPACITY,
          duration: 150,
          useNativeDriver: false,
        }).start();
      } else if (scrollVelocity.current < 0) {
        Animated.timing(tabBarOpacity, {
          toValue: OPAQUE_OPACITY,
          duration: 150,
          useNativeDriver: false,
        }).start();
      }
    });

    return () => {
      homeScrollY.removeListener(listener);
    };
  }, [homeScrollY, tabBarOpacity]);

  const animatedStyles = useMemo(() => {
    const backgroundColorInterpolation = tabBarOpacity.interpolate({
      inputRange: [TRANSPARENT_OPACITY, OPAQUE_OPACITY],
      outputRange: [
        hexToRgba(theme.backgroundColor, 0.3),
        hexToRgba(theme.backgroundColor, 1),
      ],
    });

    return {
      background: {
        backgroundColor: backgroundColorInterpolation,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    };
  }, [tabBarOpacity]);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.tintColor,
        tabBarStyle: {
          backgroundColor: theme.backgroundColor,
          position: "absolute",
          paddingTop: 15,
          bottom: 0,
          left: 0,
          right: 0,
        },
        headerShown: false,
        tabBarBackground: () => (
          <Animated.View style={animatedStyles.background} />
        ),
        tabBarIconStyle: {
          marginBottom: 10,
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/tabs/home.png")}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/tabs/search.png")}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="glayze"
        options={{
          title: "Glayze",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/tabs/glayze.png")}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/tabs/alerts.png")}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/tabs/wallet.png")}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
