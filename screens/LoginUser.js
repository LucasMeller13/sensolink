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

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#648DDB",
  },
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibilityPassword, setVisibilityPassword] = useState(false);
  const [error, setError] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const navigation = useNavigation();

  const handleGoogleLogin = () => { };

  async function handleDefaultLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      console.log("logou");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setError("Usuário não encontrado.");
          break;
        case "auth/invalid-email":
          setError("E-mail inválido.");
          break;
        case "auth/invalid-credential":
          setError("Senha incorreta.");
          break;
        case "auth/missing-password":
          setError("Digite a senha.");
          break;
        default:
          console.log(error.code);
          setError("Erro na autenticação.");
      }
    }
  }

  async function handleSendResetPassword() {
    setForgotMessage("");
    setForgotError("");
    console.log(forgotEmail);
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotMessage("E-mail enviado! Verifique a sua caixa de entrada.");
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case "auth/user-not-found":
          setForgotError("Usuário não encontrado.");
          break;
        case "auth/invalid-email":
          setForgotError("E-mail inválido.");
          break;
        default:
          setForgotError("Erro ao enviar o e-mail.");
      }
    }
  }

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Image
          source={require("../assets/sensolink-complete.png")}
          style={styles.sensolinkLogo}
        />

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, marginBottom: 5, fontWeight: "700" }}>
            E-mail
          </Text>

          <TextInput
            placeholder="Digite seu e-mail..."
            placeholderTextColor={"#a1a1a1"}
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="done"
            onSubmitEditing={handleDefaultLogin}
            contentStyle={{ height: 64 }}
            theme={{ roundness: 12 }}
            outlineStyle={{ borderWidth: 2, borderColor: "#e1e1e1" }}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              Senha
            </Text>

            <TouchableOpacity
              onPress={() => {
                setDialogVisible(true);
                setForgotEmail(email);
                setForgotMessage("");
                setForgotError("");
              }}
            >
              <Text style={{ color: theme.colors.primary, fontSize: 14, fontWeight: "700" }}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Digite sua senha..."
            placeholderTextColor={"#a1a1a1"}
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            autoCapitalize="none"
            secureTextEntry={!visibilityPassword}
            returnKeyType="done"
            onSubmitEditing={handleDefaultLogin}
            right={
              <TextInput.Icon
                icon={visibilityPassword ? "eye" : "eye-off"}
                onPress={() => setVisibilityPassword(!visibilityPassword)}
                style={{ marginTop: 16 }}
              />
            }
            contentStyle={{ height: 64 }}
            theme={{ roundness: 12 }}
            outlineStyle={{ borderWidth: 2, borderColor: "#e1e1e1" }}
          />
        </View>

        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
          >
            <Dialog.Title>Redefinir senha</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label={"E-mail"}
                value={forgotEmail}
                onChangeText={setForgotEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {forgotMessage !== "" && (
                <Text style={{ color: "green", marginTop: 0 }}>
                  {forgotMessage}
                </Text>
              )}
              {forgotError !== "" && (
                <Text style={{ color: "red", marginTop: 0 }}>
                  {forgotError}
                </Text>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
              <Button onPress={handleSendResetPassword}>Enviar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Button
          mode="contained"
          onPress={() => handleDefaultLogin()}
          contentStyle={{ height: 56 }}
          style={{ marginBottom: 2, borderRadius: 12 }}
        >
          Continuar
        </Button>

        {error !== "" && (
          <Text style={{ color: "red", marginVertical: 8 }}>{error}</Text>
        )}

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16 }}>
          <Text style={{  color: "#999999", fontSize: 16, fontWeight: "700" }}>Não tem conta? </Text>
          <TouchableOpacity>
            <Text style={{ color: "#648DDB", fontSize: 16, fontWeight: "700" }}onPress={() => navigation.navigate("RegisterUser")}>
              Cadastrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    flex: 1,
    padding: 24,
    paddingTop: 100,
    backgroundColor: "#f7f7f7",
  },
});
