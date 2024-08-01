// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.unstable_enablePackageExports = true;

// Configure package exports
config.resolver.unstable_conditionNames = ["browser", "require", "import"];
config.resolver.unstable_conditionsByPlatform = {
  ios: ["react-native", "browser", "main"],
  android: ["react-native", "browser", "main"],
  web: ["browser"],
};

module.exports = config;
