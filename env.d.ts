import "expo-constants";

declare module "expo-constants" {
  export interface Constants {
    expoConfig: {
      extra: {
        EXPO_PUBLIC_WALLET_CONNECT_ID: string;
        EXPO_PUBLIC_POSTHOG_API_KEY: string;
        EXPO_PUBLIC_SUPABASE_URL: string;
        EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
        EXPO_PUBLIC_PURCHASES_APPLE_API_KEY: string;
        EXPO_PUBLIC_PURCHASES_GOOGLE_API_KEY: string;
        EXPO_PUBLIC_PAYMASTER_KEY: string;
        EXPO_PUBLIC_ENVIRONMENT_ID: string;
        EXPO_PUBLIC_API_URL: string;
        EXPO_PUBLIC_BASE_FACTORY_ADDRESS: string;
        EXPO_PUBLIC_BASE_ENTRYPOINT_ADDRESS: string;
        EXPO_PUBLIC_CHAIN: string;
        EXPO_PUBLIC_CONTRACT_ADDRESS: string;
        EXPO_PUBLIC_USDC_ADDRESS: string;
        EXPO_PUBLIC_AURA_CONTRACT_ADDRESS: string;
        EXPO_PUBLIC_RPC_URL: string;
        DATABASE_URL: string;
        PINATA_JWT: string;
        PRIVATE_KEY: string;
      };
    };
  }
}
