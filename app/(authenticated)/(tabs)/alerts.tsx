import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useTheme } from "@/contexts/theme-context";
import { Loading } from "@/components/loading";
import { useReferral } from "@/hooks";
import Toast from "react-native-toast-message";
import { useState } from "react";
import { useSmartAccount } from "@/contexts/smart-account-context";
import { GlayzeToast } from "@/components/ui/glayze-toast";

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

  const clearAlert = async (referee: string | null | undefined) => {
    try {
      const res = await fetch(`/api/supabase/alert`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referee,
          referrer: address,
        }),
      });
      if (res.status !== 200) {
        throw new Error("Error clearing alert");
      }
      await refetch();
    } catch (error) {
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
    try {
      const res = await fetch(`/api/supabase/alert`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referrer: address,
        }),
      });
      if (res.status !== 200) {
        throw new Error("Error clearing all alerts");
      }
      await refetch();
    } catch (error) {
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
        <GlayzeToast />
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
                <TouchableOpacity onPress={() => clearAlert(alert.referee)}>
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
