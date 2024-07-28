import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { useAlerts } from "@/hooks/useAlerts";
import { supabase } from "@/utils/supabase";

export default function Alerts() {
  const { data: alerts, isLoading, isError } = useAlerts();

  if (isLoading)
    return (
      <View className="flex-1 bg-background">
        <Text>Loading...</Text>
      </View>
    );
  if (isError)
    return (
      <View className="flex-1 bg-background">
        <Text>Error loading profile</Text>
      </View>
    );
  if (!alerts)
    return (
      <View className="flex-1 bg-background">
        <Text>No profile data found</Text>
      </View>
    );

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
    <SafeAreaView className="flex-1 bg-background">
      <View className="pt-6 px-4 mb-4">
        <View className="flex-row justify-center items-center mb-4">
          <Text className="text-2xl font-bold text-white">Alerts</Text>

          {alerts.length > 0 && (
            <TouchableOpacity
              onPress={clearAllAlerts}
              className="absolute right-4 top-6"
            >
              <Text className="text-blue-500">Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {alerts.length > 0 ? (
        <ScrollView className="px-4">
          {alerts.map((alert) => (
            <View
              key={alert.id}
              className="bg-neutral rounded-lg p-4 mb-4 flex-row justify-between items-center"
            >
              <Text className="text-white flex-1 mr-2">
                {alert.is_accepted
                  ? `${alert.to} accepted your referral invite`
                  : `Your referral invite to ${alert.to} is pending`}
              </Text>
              <TouchableOpacity onPress={() => clearAlert(alert.id)}>
                <Text className="text-white">X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="w-[300px] text-3xl font-semibold text-center text-white mb-4">
            You have no alerts
          </Text>
          <Text className="w-[300px] text-center text-lg text-white opacity-40">
            You will be notified when someone accepts your referral invite
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
