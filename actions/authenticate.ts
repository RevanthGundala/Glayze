import * as LocalAuthentication from "expo-local-authentication";

export const authenticate = async (): Promise<boolean> => {
  const authenticationResult = await LocalAuthentication.authenticateAsync();
  return authenticationResult.success;
};
