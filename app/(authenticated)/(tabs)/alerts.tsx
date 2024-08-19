import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useTheme } from "@/contexts/theme-context";
import { Loading } from "@/components/loading";
import { useReferral } from "@/hooks";
import Toast from "react-native-toast-message";
import { useState } from "react";
import { useReactiveClient } from "@dynamic-labs/react-hooks";
import { client } from "@/utils/dynamic-client.native";
import { useSmartAccount } from "@/contexts/smart-account-context";

export default function Alerts() {
  const { smartAccountClient, error: smartAccountError } = useSmartAccount();
  const address = smartAccountClient?.account.address;
  const { data: alerts, isLoading, isError, refetch } = useReferral(address);
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading || isError) {
    return <Loading error={isError ? "Error loading profile" : null} />;
  }

  const clearAlert = async (
    referee: string | null | undefined,
    referrer: string | null | undefined
  ) => {
    if (!referee || !referrer) throw new Error("No referee or referrer found");
    const { error } = await supabase
      .from("Referrals")
      .update({ show: false })
      .eq("referee", referee)
      .eq("referrer", referrer);
    refetch();
    if (error) {
      console.error("Error clearing alert", error);
      Toast.show({
        text1: "Error clearing alert",
        text2: "Please try again",
        type: "error",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    }
  };

  const clearAllAlerts = async () => {
    const { error } = await supabase
      .from("Referrals")
      .update({ show: false })
      .eq("show", true);
    refetch();
    if (error) {
      console.error("Error clearing all alerts", error);
      Toast.show({
        text1: "Error clearing all alerts",
        text2: "Please try again",
        type: "error",
        visibilityTime: 2000,
        onPress: () => Toast.hide(),
      });
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textColor}
          />
        }
      >
        <Toast />
        <View className="pt-6 px-4 mb-4">
          <View className="flex-row justify-center items-center mb-4">
            {alerts && alerts.length > 0 && (
              <TouchableOpacity
                onPress={clearAllAlerts}
                className="absolute right-4 top-6"
              >
                <Text style={{ color: theme.tintColor }}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {alerts && alerts.length > 0 ? (
          <View className="mt-8 px-4">
            {alerts.map((alert, i) => (
              <View
                key={i}
                className="rounded-lg p-4 mb-4 flex-row justify-between items-center border"
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderColor: theme.mutedForegroundColor,
                }}
              >
                <Text
                  className="flex-1 mr-2"
                  style={{ color: theme.textColor }}
                >
                  {alert.pending
                    ? `${alert.referee} made a transaction!`
                    : `Waiting for ${alert.referee} to make a transaction`}
                </Text>
                <TouchableOpacity
                  onPress={() => clearAlert(alert.referrer, alert.referee)}
                >
                  <Text style={{ color: theme.textColor }}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center">
            <Text
              className="w-[300px] text-3xl font-semibold text-center mb-4"
              style={{ color: theme.textColor }}
            >
              You have no alerts
            </Text>
            <Text
              className="w-[300px] text-center text-lg"
              style={{ color: theme.mutedForegroundColor }}
            >
              You will be notified when someone accepts your referral invite
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
