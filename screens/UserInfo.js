import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Avatar, Divider } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function UserInfoView() {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigation.replace("Login");
    } catch (err) {
      console.log("Erro ao sair:", err);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Carregando informações do usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Avatar.Text
        size={96}
        label={user.displayName ? user.displayName[0].toUpperCase() : "?"}
        style={styles.avatar}
      />

      <Text style={styles.label}>Nome</Text>
      <Text style={styles.info}>{user.displayName ?? "Não informado"}</Text>

      <Divider style={styles.divider} />

      <Text style={styles.label}>E-mail</Text>
      <Text style={styles.info}>{user.email}</Text>

      <Divider style={styles.divider} />

      <Text style={styles.label}>UID</Text>
      <Text style={styles.uid}>{user.uid}</Text>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        contentStyle={{ height: 48 }}
      >
        Sair
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f7f7f7",
  },
  avatar: {
    alignSelf: "center",
    marginBottom: 32,
    backgroundColor: "#648DDB",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginBottom: 4,
  },
  info: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 16,
  },
  uid: {
    fontSize: 12,
    color: "#999",
    marginBottom: 24,
  },
  divider: {
    marginVertical: 8,
  },
  logoutButton: {
    marginTop: 32,
    borderRadius: 12,
  },
});