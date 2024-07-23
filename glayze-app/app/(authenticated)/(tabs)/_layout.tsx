import { Tabs } from "expo-router";
import { Image } from "expo-image";
import { useState, useRef, useEffect } from "react";
import { useHomeScrollY } from "@/hooks/useHomeScrollY";
import { Animated } from "react-native";

const OPAQUE_OPACITY = 1;
const TRANSPARENT_OPACITY = 0.3; // Adjust this value to your preference

export default function TabLayout() {
  const homeScrollY = useHomeScrollY();
  const [tabBarOpacity] = useState(new Animated.Value(OPAQUE_OPACITY));
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  useEffect(() => {
    const listener = homeScrollY.addListener(({ value }) => {
      scrollVelocity.current = value - lastScrollY.current;
      lastScrollY.current = value;

      if (value <= 0) {
        // At the top of the scroll view
        Animated.timing(tabBarOpacity, {
          toValue: OPAQUE_OPACITY,
          duration: 150,
          useNativeDriver: false,
        }).start();
      } else if (scrollVelocity.current > 0) {
        // Scrolling down
        Animated.timing(tabBarOpacity, {
          toValue: TRANSPARENT_OPACITY,
          duration: 150,
          useNativeDriver: false,
        }).start();
      } else if (scrollVelocity.current < 0) {
        // Scrolling up
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

  const backgroundColorInterpolation = tabBarOpacity.interpolate({
    inputRange: [TRANSPARENT_OPACITY, OPAQUE_OPACITY],
    outputRange: ["rgba(36, 36, 36, 0.3)", "rgba(36, 36, 36, 1)"],
  });

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#98EB5D",
        tabBarStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          paddingTop: 15,
          bottom: 0,
          left: 0,
          right: 0,
        },
        headerShown: false,
        tabBarBackground: () => (
          <Animated.View
            style={{
              backgroundColor:
                route.name === "home"
                  ? backgroundColorInterpolation
                  : "rgb(36, 36, 36)",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        ),
        tabBarIconStyle: {
          marginBottom: 10, // Adjust this value to increase/decrease space below the icon
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
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/tabs/profile.png")}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
