import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  Button,
  DefaultTheme,
  Dialog,
  Divider,
  PaperProvider,
  Portal,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase-sdk";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#648DDB",
  },
};

export default function RegisterUserScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [visibilityPassword, setVisibilityPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (snackbarVisible) {
      const timeout = setTimeout(() => {
        navigation.navigate("Login");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  });

  async function handleRegistrationUser() {
    if (firstPassword !== secondPassword) {
      setErrorMessage("As senhas não são iguais.");
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        firstPassword
      );
      const user = credential.user;
      await updateProfile(user, { displayName: name });
      setErrorMessage("");
      setSnackbarVisible(true);
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage("E-mail já está em uso.");
          break;
        case "auth/invalid-email":
          setErrorMessage("E-mail inválido.");
          break;
        case "auth/missing-email":
          setErrorMessage("Preencher o campo de e-mail.");
          break;
        case "auth/weak-password":
          setErrorMessage("Senha fraca, tem que possuir pelo menos 6 dígitos.");
          break;
        default:
          setErrorMessage("Erro na aplicação.");
      }
    }
  }

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../assets/sensolink-complete.png")}
            style={styles.sensolinkLogo}
          />

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, marginBottom: 5, fontWeight: "700" }}>
              Nome
            </Text>
            <TextInput
              placeholder="Digite o nome de usuário desejado..."
              placeholderTextColor={"#a1a1a1"}
              value={name}
              onChangeText={setName}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="done"
              contentStyle={{ height: 64 }}
              theme={{ roundness: 12 }}
              outlineStyle={{ borderWidth: 2, borderColor: "#e1e1e1" }}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, marginBottom: 5, fontWeight: "700" }}>
              E-mail
            </Text>
            <TextInput
              placeholder="Digite o e-mail desejado..."
              placeholderTextColor={"#a1a1a1"}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="done"
              contentStyle={{ height: 64 }}
              theme={{ roundness: 12 }}
              outlineStyle={{ borderWidth: 2, borderColor: "#e1e1e1" }}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, marginBottom: 5, fontWeight: "700" }}>
              Senha
            </Text>
            <TextInput
              placeholder="Digite a senha desejada..."
              placeholderTextColor={"#a1a1a1"}
              value={firstPassword}
              onChangeText={setFirstPassword}
              mode="outlined"
              autoCapitalize="none"
              secureTextEntry={!visibilityPassword}
              returnKeyType="done"
              contentStyle={{ height: 64 }}
              theme={{ roundness: 12 }}
              outlineStyle={{ borderWidth: 2, borderColor: "#e1e1e1" }}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 18, marginBottom: 5, fontWeight: "700" }}>
              Confirme sua senha
            </Text>
            <TextInput
              placeholder="Confirme a senha desejada..."
              placeholderTextColor={"#a1a1a1"}
              value={secondPassword}
              onChangeText={setSecondPassword}
              mode="outlined"
              autoCapitalize="none"
              secureTextEntry={!visibilityPassword}
              returnKeyType="done"
              onSubmitEditing={handleRegistrationUser}
              contentStyle={{ height: 64 }}
              theme={{ roundness: 12 }}
              outlineStyle={{ borderWidth: 2, borderColor: "#e1e1e1" }}
            />
          </View>

          {/* <Portal>
                        <Snackbar
                            visible={snackbarVisible}
                            onDismiss={() => setSnackbarVisible(false)}
                            duration={2000}
                            style={{ backgroundColor: '#E7F9ED', borderRadius: 12 }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="check-circle" size={22} color="#33cc66" style={{ marginRight: 8 }} />
                                <Text style={{ color: "#219653" }}>Usuário cadastrado com sucesso!</Text>
                            </View>
                        </Snackbar>
                    </Portal> */}

          <Button
            mode="contained"
            onPress={handleRegistrationUser}
            contentStyle={{ height: 56 }}
            style={{ marginBottom: 2, borderRadius: 12 }}
          >
            Cadastrar
          </Button>

          {errorMessage !== "" && (
            <Text style={{ color: "red" }}>{errorMessage}</Text>
          )}
          
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  sensolinkLogo: {
    height: 170,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 24,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 100,
    justifyContent: "center",
    backgroundColor: "#f7f7f7",
  },
});
