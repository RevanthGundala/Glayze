import { Circle, useFont } from "@shopify/react-native-skia";
import { View, Text, Pressable } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import SpaceMono from "@/assets/fonts/SpaceMono-Regular.ttf";
import type { SharedValue } from "react-native-reanimated";
import React, { useEffect, useRef, useState } from "react";
import { Time } from "@/utils/types";
import { Image } from "expo-image";
import { colors } from "@/utils/theme";
import { useTheme } from "../contexts/theme-context";

type GraphProps = {
  price: number;
  change: number;
  symbol: string;
  selectedTime: Time;
  setSelectedTime: React.Dispatch<React.SetStateAction<Time>>;
};

export const Graph = ({
  price,
  change,
  symbol,
  selectedTime,
  setSelectedTime,
}: GraphProps) => {
  const times: Time[] = ["1H", "1D", "1W", "1M", "ALL"];
  const font = useFont(SpaceMono, 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });
  const { theme } = useTheme();
  return (
    <View>
      <View className="px-10">
        <Text
          className="text-3xl font semi-bold py-2"
          style={{ color: theme.textColor }}
        >
          ${price} {symbol}
        </Text>
        {change >= 0 ? (
          <View className="flex flex-row items-center space-x-1">
            <Image
              source={require("@/assets/images/up-arrow.png")}
              className="w-4 h-4"
            />
            <Text className="text-lg" style={{ color: colors.greenTintColor }}>
              {change}%
            </Text>
          </View>
        ) : (
          <View className="flex flex-row items-center space-x-1">
            <Image
              source={require("@/assets/images/down-arrow.png")}
              className="w-4 h-4"
            />
            <Text className="text-lg" style={{ color: colors.redTintColor }}>
              {change}%
            </Text>
          </View>
        )}
      </View>
      <View style={{ height: 300, padding: 12 }}>
        <CartesianChart
          data={DATA}
          xKey="timestamp"
          yKeys={["price"]}
          axisOptions={{
            font,
            tickCount: 5,
            labelColor: theme.textColor,
            lineColor: {
              grid: {
                x: 0,
                y: theme.mutedForegroundColor,
              },
              frame: theme.secondaryTextColor,
            },
            formatYLabel: (num) => `$${num}`,
            formatXLabel: () => "",
          }}
          chartPressState={state}
        >
          {({ points }) => (
            <>
              <Line
                points={points.price}
                color={
                  change >= 0 ? colors.greenTintColor : colors.redTintColor
                }
                strokeWidth={3}
              />
              {isActive && (
                <ToolTip x={state.x.position} y={state.y.price.position} />
              )}
            </>
          )}
        </CartesianChart>
      </View>
      <View className="flex flex-row justify-between items-center px-12">
        {times.map((time, i) => (
          <Pressable key={i} onPress={() => setSelectedTime(time)}>
            <Text
              style={{
                color:
                  time === selectedTime
                    ? theme.textColor
                    : theme.mutedForegroundColor,
              }}
            >
              {time}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  const { theme } = useTheme();
  return <Circle cx={x} cy={y} r={8} color={theme.textColor} />;
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  timestamp: i,
  price: 40 + 30 * Math.random(),
}));
