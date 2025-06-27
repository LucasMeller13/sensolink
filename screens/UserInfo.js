import { useEffect, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text, Button, Avatar, Divider } from "react-native-paper";
import { getAuth, updateProfile, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import styles from "../styles/globalStyles";

export default function UserInfoView() {
  const [user, setUser] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setPhotoURL(currentUser.photoURL);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigation.replace("Login");
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão de galeria negada.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newUri = result.assets[0].uri;
      const auth = getAuth();
      await updateProfile(auth.currentUser, { photoURL: newUri });
      setPhotoURL(newUri);
    }
  };

  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Carregando informações do usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.userInfoContainer}>
      <TouchableOpacity onPress={handlePickImage}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.userPhoto} />
        ) : (
          <Avatar.Text
            size={96}
            label={user.displayName ? user.displayName[0].toUpperCase() : "?"}
            style={styles.avatarPrimary}
          />
        )}
      </TouchableOpacity>

      <Text style={styles.userInfoLabel}>Nome</Text>
      <Text style={styles.userInfoValue}>{user.displayName ?? "Não informado"}</Text>

      <Divider style={styles.userInfoDivider} />

      <Text style={styles.userInfoLabel}>E-mail</Text>
      <Text style={styles.userInfoValue}>{user.email}</Text>

      <Divider style={styles.userInfoDivider} />

      <Text style={styles.userInfoLabel}>UID</Text>
      <Text style={styles.userInfoUid}>{user.uid}</Text>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.userLogoutButton}
        contentStyle={{ height: 48 }}
      >
        Sair
      </Button>
    </View>
  );
}