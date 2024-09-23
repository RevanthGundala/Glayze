module.exports = {
  globDirectory: "app/",
  globPatterns: ["**/*.{tsx,ts}"],
  swDest: "app/dist/sw.js",
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};
