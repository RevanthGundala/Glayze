import React from "react";
import Svg, { G, Path, LinearGradient, Stop, Defs } from "react-native-svg";

export const VerifiedBusiness = () => (
  <Svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    accessibilityLabel="Verified account"
    accessibilityRole="image"
  >
    <Defs>
      <LinearGradient
        id="0-a"
        x1={4.411}
        y1={2.495}
        x2={18.083}
        y2={21.508}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#f4e72a" />
        <Stop offset={0.539} stopColor="#cd8105" />
        <Stop offset={0.68} stopColor="#cb7b00" />
        <Stop offset={1} stopColor="#f4ec26" />
        <Stop offset={1} stopColor="#f4e72a" />
      </LinearGradient>
      <LinearGradient
        id="0-b"
        x1={5.355}
        y1={3.395}
        x2={16.361}
        y2={19.133}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#f9e87f" />
        <Stop offset={0.406} stopColor="#e2b719" />
        <Stop offset={0.989} stopColor="#e2b719" />
      </LinearGradient>
    </Defs>
    <G clipRule="evenodd" fillRule="evenodd">
      <Path
        d="M13.324 3.848L11 1.6 8.676 3.848l-3.201-.453-.559 3.184L2.06 8.095 3.48 11l-1.42 2.904 2.856 1.516.559 3.184 3.201-.452L11 20.4l2.324-2.248 3.201.452.559-3.184 2.856-1.516L18.52 11l1.42-2.905-2.856-1.516-.559-3.184zm-7.09 7.575l3.428 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z"
        fill="url(#0-a)"
      />
      <Path
        d="M13.101 4.533L11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z"
        fill="url(#0-b)"
      />
      <Path
        d="M6.233 11.423l3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z"
        fill="#d18800"
      />
    </G>
  </Svg>
);
