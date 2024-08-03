// import { useQuery } from "@tanstack/react-query";
// import Purchases, { PurchasesStoreProduct } from "react-native-purchases";
// import { usePurchases } from "@/contexts/purchase-context";

// const fetchProduct = async (productId: string) => {
//   try {
//     const products = await Purchases.getProducts([productId]);
//     if (products.length > 0) {
//       return products[0];
//     } else {
//       console.log("No products found");
//     }
//   } catch (e) {
//     console.error("Error fetching product:", e);
//   }
//   return null;
// };

// export const useProduct = (productId: string) => {
//   //   const { isReady } = usePurchases();
//   //   console.log("isready: ", isReady);
//   //   if (!isReady) return null;
//   return useQuery<PurchasesStoreProduct | null, Error>({
//     queryKey: ["product", productId],
//     queryFn: () => fetchProduct(productId),
//   });
// };
