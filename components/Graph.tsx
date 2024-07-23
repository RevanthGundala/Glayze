import { Circle, useFont } from "@shopify/react-native-skia";
import { View } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import SpaceMono from "@/assets/fonts/SpaceMono-Regular.ttf";
import type { SharedValue } from "react-native-reanimated";
import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";

type GraphProps = {
  price: number;
  change: number;
};

export const Graph = ({ price, change }: GraphProps) => {
  const [selectedTime, setSelectedTime] = useState("LIVE");
  const [chartData, setChartData] = useState<any[]>([]);
  const times = ["LIVE", "1H", "1D", "1W", "1M", "ALL"];
  // const font = useFont(SpaceMono, 12);
  // const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  // return (
  //   <View style={{ height: 300 }}>
  //     <CartesianChart
  //       data={DATA}
  //       xKey="timestamp"
  //       yKeys={["price"]}
  //       axisOptions={{
  //         font,
  //         tickCount: 5,
  //         labelColor: "white",
  //         formatYLabel: (num) => `$${num}`,
  //         formatXLabel: () => "",
  //       }}
  //       chartPressState={state}
  //     >
  //       {({ points }) => (
  //         <>
  //           <Line points={points.price} color="red" strokeWidth={3} />
  //           {isActive && (
  //             <ToolTip x={state.x.position} y={state.y.price.position} />
  //           )}
  //         </>
  //       )}
  //     </CartesianChart>
  //   </View>
  // );
};

// function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
//   return <Circle cx={x} cy={y} r={8} color="black" />;
// }

// const DATA = Array.from({ length: 31 }, (_, i) => ({
//   timestamp: i,
//   price: 40 + 30 * Math.random(),
// }));
