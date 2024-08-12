import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useAlerts } from "@/hooks/use-alerts";
import { supabase } from "@/utils/supabase";
import { useTheme } from "@/contexts/theme-context";
import { Loading } from "@/components/loading";

export default function Alerts() {
  const { data: alerts, isLoading, isError } = useAlerts();
  const { theme } = useTheme();

  if (isLoading || isError) {
    return <Loading error={isError ? "Error loading profile" : null} />;
  }

  const clearAlert = async (id: number) => {
    const { error } = await supabase
      .from("Referrals")
      .update({ show: false })
      .eq("id", id);
    if (error) {
      console.error("Error clearing alert", error);
    }
  };

  const clearAllAlerts = async () => {
    const { error } = await supabase
      .from("Referrals")
      .update({ show: false })
      .eq("show", true);
    if (error) {
      console.error("Error clearing all alerts", error);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <View className="pt-6 px-4 mb-4">
        <View className="flex-row justify-center items-center mb-4">
          {alerts.length > 0 && (
            <TouchableOpacity
              onPress={clearAllAlerts}
              className="absolute right-4 top-6"
            >
              <Text style={{ color: theme.tintColor }}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {alerts.length > 0 ? (
        <ScrollView className="px-4">
          {alerts.map((alert) => (
            <View
              key={alert.id}
              className="rounded-lg p-4 mb-4 flex-row justify-between items-center"
              style={{ backgroundColor: theme.secondaryBackgroundColor }}
            >
              <Text className="flex-1 mr-2" style={{ color: theme.textColor }}>
                {alert.is_accepted
                  ? `${alert.to} accepted your referral invite`
                  : `Your referral invite to ${alert.to} is pending`}
              </Text>
              <TouchableOpacity onPress={() => clearAlert(alert.id)}>
                <Text style={{ color: theme.textColor }}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
    </SafeAreaView>
  );
}
