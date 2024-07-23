import React, { useRef } from "react";
import { View, Text, Animated, PanResponder } from "react-native";
import { Image } from "expo-image";

type SwipeButtonProps = {
  text: string;
  primaryColor: string;
  onComplete: () => void;
};

export const SwipeButton = ({
  text,
  primaryColor,
  onComplete,
}: SwipeButtonProps) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx > 200) {
        onComplete();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <View className="mt-12 w-full h-14 bg-neutral rounded-full overflow-hidden flex-row items-center">
      <Animated.View
        className={`${primaryColor} h-full px-6 rounded-full items-center justify-center opacity-80 left-0 absolute`}
        style={{
          transform: [{ translateX: pan.x }],
        }}
        {...panResponder.panHandlers}
      >
        <Image
          source={require("@/assets/images/double-right-arrow.png")}
          className="w-8 h-8"
        />
      </Animated.View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-white opacity-70 pl-6">{text}</Text>
      </View>
    </View>
  );
};
