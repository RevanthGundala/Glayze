import { Circle, useFont } from "@shopify/react-native-skia";
import { View, Text, Pressable } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import SpaceMono from "@/assets/fonts/SpaceMono-Regular.ttf";
import type { SharedValue } from "react-native-reanimated";
import React, { useEffect, useRef, useState } from "react";
import { Time } from "@/utils/types";

type GraphProps = {
  price: number;
  change: number;
  symbol: string;
};

export const Graph = ({ price, change, symbol }: GraphProps) => {
  const [selectedTime, setSelectedTime] = useState<Time>("LIVE");
  const [chartData, setChartData] = useState<any[]>([]);
  const times: Time[] = ["LIVE", "1H", "1D", "1W", "1M", "ALL"];
  const font = useFont(SpaceMono, 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  return (
    <View>
      <Text className="text-white text-3xl font-bold px-12 py-2">
        ${price} {symbol}
      </Text>
      {change > 0 ? (
        <Text className="text-green-500 text-lg px-12">{change}%</Text>
      ) : (
        <Text className="text-red-500 text-sm px-12">{change}%</Text>
      )}
      <View style={{ height: 300, padding: 12 }}>
        <CartesianChart
          data={DATA}
          xKey="timestamp"
          yKeys={["price"]}
          axisOptions={{
            font,
            tickCount: 5,
            labelColor: "white",
            lineColor: {
              grid: {
                x: 0,
                y: "gray",
              },
              frame: "white",
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
                color={change > 0 ? "green" : "red"}
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
              className={`${
                time === selectedTime ? "text-white" : "text-gray-500"
              }`}
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
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  timestamp: i,
  price: 40 + 30 * Math.random(),
}));
