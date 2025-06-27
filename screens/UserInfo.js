import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Button,
  DefaultTheme,
  Dialog,
  Divider,
  PaperProvider,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase-sdk";
import { useNavigation } from "@react-navigation/native";

export default function UserInfoView() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Em manutenção...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});