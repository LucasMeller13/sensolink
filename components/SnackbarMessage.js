import React from "react";
import { Snackbar, Text } from "react-native-paper";
import { View } from "react-native";
import styles from "../styles/globalStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function SnackbarMessage({ visible, onDismiss, message }) {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={2000}
      style={styles.snackbar}
    >
      <View style={styles.snackbarContent}>
        <MaterialIcons
          name="check-circle"
          size={22}
          color="#33cc66"
          style={styles.snackbarIcon}
        />
        <Text style={styles.snackbarText}>{message}</Text>
      </View>
    </Snackbar>
  );
}
