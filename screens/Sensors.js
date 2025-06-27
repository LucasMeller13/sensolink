import { useState, useLayoutEffect, useEffect } from "react";
import { ScrollView } from "react-native";
import { PaperProvider, Text } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  collection,
  where,
  onSnapshot,
  query,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase-sdk";

import theme from "../styles/theme";
import styles from "../styles/globalStyles";
import SensorCard from "../components/SensorCard";
import SortButtons from "../components/SortButtons";
import { TouchableOpacity, View } from "react-native";

export default function SensorView() {
  const [sensors, setSensors] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigation = useNavigation();
  const auth_user = getAuth();

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const userId = auth_user.currentUser.uid;
    const q = query(collection(db, "sensors"), where("user_id", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setSensors(results);
    });

    return () => unsubscribe();
  }, [auth_user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={async () => {
              if (sensors.length === 0) {
                alert("Nenhum sensor para exportar.");
                return;
              }
              try {
                await exportSensorsAndShare(sensors);
              } catch (e) {
                alert("Erro ao exportar: " + e.message);
              }
            }}
          >
            <Feather
              style={{ paddingRight: 18, paddingTop: 9 }}
              name="share-2"
              size={27}
              color="#648DDB"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ManageSensorView")}
          >
            <Feather
              style={{ paddingRight: 20, paddingTop: 7 }}
              name="plus-square"
              size={30}
              color="#648DDB"
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, sensors]);

  async function exportSensorsAndShare(sensors) {
    const csv = sensorsToCSV(sensors);
    const filename = "sensors.csv";
    const fileUri = FileSystem.cacheDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, csv);
    await Sharing.shareAsync(fileUri, {
      mimeType: "text/csv",
      dialogTitle: "Compartilhar dados dos sensores",
      UTI: "public.comma-separated-values-text",
    });
  }

  function sensorsToCSV(sensors) {
    const header = ["ID", "Name", "Description", "Output Values", "Last Update"];
    const lines = sensors.map((sensor) => {
      const outputValues = (sensor.output_values || []).join("; ");
      const lastUpdate = sensor.updated_at
        ? new Date(sensor.updated_at.seconds * 1000).toLocaleString("pt-BR", {
            hour12: false,
          })
        : "";
      const csvEscape = (v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`;
      return [
        csvEscape(sensor.id),
        csvEscape(sensor.name),
        csvEscape(sensor.description),
        csvEscape(outputValues),
        csvEscape(lastUpdate),
      ].join(",");
    });
    return [header.join(","), ...lines].join("\n");
  }

  function getSensorStatus(sensor) {
    const freqSecs = Number(sensor.frequency);
    const created_at = new Date(sensor.created_at.seconds * 1000);
    const lastUpdate = new Date(sensor.updated_at.seconds * 1000);
    const now = new Date();
    const diffSecs = (now - lastUpdate) / 1000;

    if (diffSecs > 1.5 * freqSecs || (lastUpdate - created_at) / 1000 < 10) {
      return { text: "Offline", color: "#FF575A" };
    } else {
      return { text: "Online", color: "#31D728" };
    }
  }

  function handleCardPress(sensor) {
    navigation.navigate("ManageSensorView", { sensor });
  }

  function getSortedSensors() {
    let sorted = [...sensors];

    if (sortBy === "name") {
      sorted.sort((a, b) => {
        const aName = (a.name || "").toLowerCase();
        const bName = (b.name || "").toLowerCase();
        return sortDirection === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName);
      });
    } else if (sortBy === "updated_at") {
      sorted.sort((a, b) => {
        const aTime = a.updated_at?.seconds || 0;
        const bTime = b.updated_at?.seconds || 0;
        return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
      });
    }

    return sorted;
  }

  return (
    <PaperProvider theme={theme}>
      <ScrollView contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 4 }}>
        <SortButtons
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />

        {getSortedSensors().length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 48, color: "#999", fontSize: 15 }}>
            Nenhum sensor cadastrado no momento.
          </Text>
        ) : (
          getSortedSensors().map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              status={getSensorStatus(sensor)}
              onPress={() => handleCardPress(sensor)}
            />
          ))
        )}
      </ScrollView>
    </PaperProvider>
  );
}
