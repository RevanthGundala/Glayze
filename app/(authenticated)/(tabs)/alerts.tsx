import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { Alert } from "../../../utils/types";

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, message: "John Doe accepted your referral invite" },
    { id: 2, message: "Jane Smith accepted your referral invite" },
    // Add more alerts as needed
  ]);

  const clearAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
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
              <Text className="text-white flex-1 mr-2">{alert.message}</Text>
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
