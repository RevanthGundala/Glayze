import "@expo/metro-runtime";
import "expo-router/entry"; // Let expo-router handle rendering
import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

// Preload Skia before the app renders
LoadSkiaWeb().catch((err) => console.error("Skia Web Load Error:", err));
