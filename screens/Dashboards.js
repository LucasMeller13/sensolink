import { useLayoutEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/globalStyles";

export default function DashboardView() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ManageDashboardView")}
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
  }, [navigation]);

  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.maintenanceText}>Em manutenção...</Text>
    </View>
  );
}
