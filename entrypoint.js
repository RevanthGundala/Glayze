import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Import required polyfills first
import "fast-text-encoding";
import "react-native-get-random-values";
import "@ethersproject/shims";
import "expo-router";

function App() {
  return (
    <ExpoRoot context={require.context("./app", true, /\.(js|jsx|ts|tsx)$/)} />
  );
}

registerRootComponent(App);
