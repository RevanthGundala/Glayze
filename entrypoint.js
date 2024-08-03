import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { withIAPContext } from "react-native-iap";

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

const AppWithIAP = withIAPContext(App);

registerRootComponent(AppWithIAP);
