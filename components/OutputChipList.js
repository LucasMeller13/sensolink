import React from "react";
import { View } from "react-native";
import { Chip } from "react-native-paper";
import styles from "../styles/globalStyles";

export default function OutputChipList({ items, onRemove, disabled }) {
  return (
    <View style={styles.chipContainer}>
      {items.map((item) => (
        <Chip
          key={item}
          onClose={() => onRemove(item)}
          style={styles.chip}
          mode="flat"
          disabled={disabled}
        >
          {item}
        </Chip>
      ))}
    </View>
  );
}
