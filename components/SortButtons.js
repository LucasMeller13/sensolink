// components/SortButtons.js
import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import styles from "../styles/globalStyles";

export default function SortButtons({ sortBy, setSortBy, sortDirection, setSortDirection }) {
  return (
    <View style={styles.sortButtonRow}>
      <Button
        mode={sortBy === "name" ? "contained" : "outlined"}
        style={styles.button_order}
        onPress={() => setSortBy("name")}
      >
        Alfabética
      </Button>
      <Button
        mode={sortBy === "updated_at" ? "contained" : "outlined"}
        style={styles.button_order}
        onPress={() => setSortBy("updated_at")}
      >
        Última atualização
      </Button>
      <Button
        icon={sortDirection === "asc" ? "arrow-up" : "arrow-down"}
        compact
        onPress={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
      />
    </View>
  );
}
