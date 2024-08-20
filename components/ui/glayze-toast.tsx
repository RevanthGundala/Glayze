import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export const GlayzeToast = () => {
  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={[styles.toast, { borderLeftColor: "green" }]}
        contentContainerStyle={styles.toastContent}
        text1Style={styles.toastText1}
        text2Style={styles.toastText2}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={[styles.toast, { borderLeftColor: "red" }]}
        contentContainerStyle={styles.toastContent}
        text1Style={styles.toastText1}
        text2Style={styles.toastText2}
      />
    ),
  };

  const styles = StyleSheet.create({
    toast: {
      borderLeftWidth: 5,
      marginTop: 60,
      zIndex: 100,
    },
    toastContent: {
      paddingHorizontal: 15,
    },
    toastText1: {
      fontSize: 15,
      fontWeight: "500",
    },
    toastText2: {
      fontSize: 13,
    },
  });

  return <Toast config={toastConfig} position="top" topOffset={0} />;
};
