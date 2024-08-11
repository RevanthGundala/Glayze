import "fast-text-encoding";
import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import "./utils/dynamic-client";
import { polyfillWebCrypto } from "expo-standard-web-crypto";
import { randomUUID } from "expo-crypto";

polyfillWebCrypto();
crypto.randomUUID = randomUUID;
import "expo-router/entry";
