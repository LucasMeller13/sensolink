import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import styles from "../styles/globalStyles";

export default function SensorCard({ sensor, status, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 4, paddingRight: 12, justifyContent: "center" }}>
            <Text style={styles.title}>{sensor.name}</Text>
            <Text style={styles.desc}>
              <Text style={{ fontWeight: "bold" }}>Descrição: </Text>
              {sensor.description?.trim() || "Sem descrição."}
            </Text>
            <Text style={styles.infoLine}>
              <Text style={styles.label}>ID: </Text>
              {sensor.id}
            </Text>
            <Text style={styles.infoLine}>
              <Text style={styles.label}>Tipos de dados: </Text>
              {(sensor.output_values || []).join(", ") || "Nenhum"}
            </Text>
            <Text style={styles.lastData}>
              Criado em: {formatDate(sensor.created_at)}
            </Text>
            <Text style={styles.lastData}>
              Última atualização: {formatDate(sensor.updated_at)}
            </Text>
          </View>

          <View style={styles.dividerVertical} />

          <View style={styles.statusWrapper}>
            <Text style={[styles.status, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function formatDate(firestoreTimestamp) {
  if (!firestoreTimestamp) return "--";
  return new Date(firestoreTimestamp.seconds * 1000).toLocaleString("pt-BR", {
    hour12: false,
  });
}
