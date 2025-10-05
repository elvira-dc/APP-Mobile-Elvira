import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { AuthProvider } from "@context/AuthContext";
import AppNavigator from "@navigation/AppNavigator";
import { COLORS } from "@constants/colors";

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <AppNavigator />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
