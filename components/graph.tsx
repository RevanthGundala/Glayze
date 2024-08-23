import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import SpaceMono from "@/assets/fonts/SpaceMono-Regular.ttf";
import type { SharedValue } from "react-native-reanimated";
import { Time } from "@/utils/types";
import { Image } from "expo-image";
import { colors } from "@/utils/theme";
import { useTheme } from "../contexts/theme-context";
import { formatUSDC } from "@/utils/helpers";
import { usePriceHistory } from "@/hooks";
import { useLocalSearchParams } from "expo-router";

type GraphProps = {
  price: string | undefined;
};

export const Graph = ({ price }: GraphProps) => {
  const { id } = useLocalSearchParams();
  const [selectedTime, setSelectedTime] = useState<Time>("1H");
  const { data: priceHistory } = usePriceHistory(id as string);
  const times: Time[] = ["1H", "1D", "1W", "1M", "ALL"];
  const font = useFont(SpaceMono, 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });
  const { theme } = useTheme();
  const selectedPeriodData = useMemo(() => {
    if (!priceHistory) return null;
    switch (selectedTime) {
      case "1H":
        return priceHistory.oneHour;
      case "1D":
        return priceHistory.oneDay;
      case "1W":
        return priceHistory.oneWeek;
      case "1M":
        return priceHistory.oneMonth;
      case "ALL":
        return priceHistory.allTime;
      default:
        return priceHistory.allTime;
    }
  }, [priceHistory, selectedTime]);

  const chartData = useMemo(() => {
    if (
      !selectedPeriodData ||
      !selectedPeriodData.chartPrices ||
      selectedPeriodData.chartPrices.length < 2
    ) {
      console.log("Not enough chart data");
      return [];
    }
    return [...selectedPeriodData.chartPrices]
      .reverse()
      .map((price, index) => ({
        timestamp: index,
        price: typeof price === "number" && !isNaN(price) ? price : null,
      }))
      .filter((item) => item.price !== null);
  }, [selectedPeriodData]);

  const change = selectedPeriodData?.change;

  const renderChart = chartData.length >= 2;

  return (
    <View>
      <View className="px-10">
        <Text
          className="text-3xl font-semibold py-2"
          style={{ color: theme.textColor }}
        >
          ${formatUSDC(price)}
        </Text>
        {change !== undefined && (
          <View className="flex flex-row items-center space-x-1">
            <Image
              source={
                change >= 0
                  ? require("@/assets/images/aux/up-arrow.png")
                  : require("@/assets/images/aux/down-arrow.png")
              }
              className="w-4 h-4"
            />
            <Text
              className="text-lg"
              style={{
                color:
                  change >= 0 ? colors.greenTintColor : colors.redTintColor,
              }}
            >
              {Math.abs(change).toFixed(2)}%
            </Text>
          </View>
        )}
      </View>
      <View style={{ height: 300, padding: 14 }}>
        {renderChart ? (
          <CartesianChart
            data={chartData}
            xKey="timestamp"
            yKeys={["price"]}
            axisOptions={{
              font,
              tickCount: 5,
              labelColor: theme.textColor,
              lineColor: {
                grid: theme.mutedForegroundColor,
                frame: theme.secondaryTextColor,
              },
              formatYLabel: (num) => `$${num ? num.toFixed(2) : "..."}`,
              formatXLabel: () => "",
            }}
            chartPressState={state}
          >
            {({ points }) => (
              <>
                <Line
                  points={points.price}
                  color={
                    change !== undefined && change >= 0
                      ? colors.greenTintColor
                      : colors.redTintColor
                  }
                  strokeWidth={3}
                />
                {isActive && (
                  <ToolTip x={state.x.position} y={state.y.price.position} />
                )}
              </>
            )}
          </CartesianChart>
        ) : (
          <Text
            className="text-xl font-semibold py-6 text-center"
            style={{ color: theme.textColor }}
          >
            Not Enough Trades 😢
          </Text>
        )}
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
