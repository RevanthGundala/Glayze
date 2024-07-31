import * as LocalAuthentication from "expo-local-authentication";

export const authenticate = async () => {
  const success = await LocalAuthentication.authenticateAsync();
  return success;
};
