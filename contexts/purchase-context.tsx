// import React, { createContext, useContext, useEffect, useState } from "react";
// import Purchases from "react-native-purchases";
// import { Platform } from "react-native";

// const PurchasesContext = createContext<{ isReady: boolean }>({
//   isReady: false,
// });

// export const PurchasesProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const initPurchases = async () => {
//       Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

//       try {
//         if (Platform.OS === "ios") {
//           Purchases.configure({
//             apiKey: process.env.EXPO_PUBLIC_PURCHASES_APPLE_API_KEY!,
//           });
//         } else if (Platform.OS === "android") {
//           Purchases.configure({
//             apiKey: process.env.EXPO_PUBLIC_PURCHASES_GOOGLE_API_KEY!,
//           });
//         }
//         setIsReady(true);
//       } catch (error) {
//         console.error("Failed to configure Purchases:", error);
//       }
//     };

//     initPurchases();
//   }, []);

//   return (
//     <PurchasesContext.Provider value={{ isReady }}>
//       {children}
//     </PurchasesContext.Provider>
//   );
// };

// export const usePurchases = () => useContext(PurchasesContext);
