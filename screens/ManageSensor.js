import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import {
  Button,
  Chip,
  DefaultTheme,
  Dialog,
  Divider,
  PaperProvider,
  Portal,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import { auth, db } from "../firebase-sdk";
import { useNavigation } from "@react-navigation/native";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#648DDB",
  },
};

export default function ManageSensorView() {
  const route = useRoute();
  const { sensor } = route.params || {};
  const navigation = useNavigation();

  const [arrayOutputValues, setArrayOutputValues] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [error, setError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  
  useEffect(() => {
    if (sensor) {
      setName(sensor.name || "");
      setDescription(sensor.description || "");
      setFrequency(sensor.frequency || "");
      setArrayOutputValues(sensor.output_values || []);
    }
  }, [sensor]);

  useEffect(() => {
    if (snackbarVisible) {
      const timeout = setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }, 1500); // o mesmo tempo do Snackbar

      return () => clearTimeout(timeout);
    }
  }, [snackbarVisible, navigation]);

  const auth_user = getAuth();

  function addOutputValues(value) {
    value = value.trim();
    if (!arrayOutputValues.includes(value) && value !== "") {
      setArrayOutputValues([...arrayOutputValues, value]);
    }
    setOutputValue("");
  }

  function removeOutputValues(value) {
    setArrayOutputValues(arrayOutputValues.filter((item) => item !== value));
  }

  async function handleDeleteSensor() {
    if (!sensor || !sensor.id) return;
    try {
      await deleteDoc(doc(collection(db, "sensors"), sensor.id));
      setSnackbarVisible(true);
      setError("");
      if (navigation.canGoBack()) navigation.goBack();
    } catch (error) {
      setError(error.message || String(error));
      setSnackbarVisible(true);
    }
  }

  async function handleSensorRegistration() {
    const dados = {
      name: name,
      description: description,
      frequency: frequency,
      output_values: arrayOutputValues,
      user_id: auth_user.currentUser.uid,
    };

    if (!sensor) {
      dados.created_at = new Date();
      dados.updated_at = new Date();
    }

    if (name === "") {
      setError("Preencha o campo de nome.");
      return;
    } else if (frequency === "") {
      setError("Preencha o campo de frequência.");
      return;
    } else if (isNaN(Number(frequency)) || Number(frequency) <= 0) {
      setError("O campo frequência deve ser um número maior que zero.");
      return;
    } else if (arrayOutputValues.length == 0) {
      setError("Preencha pelo menos um nome do dado.");
      return;
    } else if (description.length > 150) {
      setError("Descrição maior que 150 caracteres.");
      return;
    }

    try {
      if (sensor && sensor.id) {
        await updateDoc(doc(collection(db, "sensors"), sensor.id), dados);
        setError("");
        setSnackbarVisible(true);
      } else {
        await addDoc(collection(db, "sensors"), dados);
        setError("");
        setSnackbarVisible(true);
      }
    } catch (error) {
      setError(error.message || String(error));
      setSnackbarVisible(true);
    }
  }

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "undefined"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.imageContainer}
            >
              <Image
                source={
                  imageUri
                    ? { uri: imageUri }
                    : require("../assets/camera-icon.png")
                }
                style={[
                  styles.circularImage,
                  !imageUri && styles.placeholderImage,
                ]}
              />
            </TouchableOpacity>

            <TextInput
              label="Nome do sensor"
              mode="outlined"
              value={name}
              onChangeText={setName}
              disabled={snackbarVisible}
            />

            <TextInput
              label="Descrição ou informações adicionais"
              mode="outlined"
              value={description}
              onChangeText={setDescription}
              disabled={snackbarVisible}
              multiline={true}
            />

            {sensor && sensor.id && (
              <TextInput
                label="ID do sensor"
                mode="outlined"
                value={sensor.id}
                editable={false}
                disabled={snackbarVisible}
                right={
                  <TextInput.Icon
                    icon="content-copy"
                    onPress={() => Clipboard.setStringAsync(sensor.id)}
                  />
                }
              />
            )}

            <TextInput
              label="Frequência dos dados (em segundos)"
              mode="outlined"
              autoCapitalize="none"
              keyboardType="numeric"
              value={frequency}
              onChangeText={setFrequency}
              disabled={snackbarVisible}
            />

            <TextInput
              label="Nome do dado (e.g, temperatura, humidade)"
              value={outputValue}
              onChangeText={setOutputValue}
              mode="outlined"
              autoCapitalize="none"
              right={
                <TextInput.Icon
                  icon="plus"
                  onPress={() => addOutputValues(outputValue)}
                />
              }
              returnKeyType="done"
              onSubmitEditing={() => addOutputValues(outputValue)}
              disabled={snackbarVisible}
            />

            <View style={styles.chipContainer}>
              {arrayOutputValues.map((item) => (
                <Chip
                  key={item}
                  mode="flat"
                  onClose={() => removeOutputValues(item)}
                  style={styles.chip}
                  disabled={snackbarVisible}
                >
                  {item}
                </Chip>
              ))}
            </View>

            {error !== "" && <Text style={styles.errorText}>{error}</Text>}
          </ScrollView>

          {/* Botões fixos */}
          <View style={styles.fixedButtons}>
            {sensor && sensor.id && (
              <Button
                mode="contained"
                onPress={() => {
                  Keyboard.dismiss();
                  setShowConfirmDelete(true);
                }}
                buttonColor="#FF575A"
                textColor="#fff"
                style={[styles.button, styles.buttonDelete]}
                contentStyle={styles.buttonContent}
                disabled={snackbarVisible}
              >
                Deletar
              </Button>
            )}

            <Button
              mode="contained"
              onPress={() => {
                Keyboard.dismiss();
                setShowConfirmSave(true);
              }}
              contentStyle={styles.buttonContent}
              style={[styles.button, styles.buttonSave]}
              disabled={snackbarVisible}
            >
              Salvar
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Diálogos e snackbar continuam abaixo normalmente */}
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          style={styles.snackbar}
        >
          <View style={styles.snackbarContent}>
            <MaterialIcons
              name="check-circle"
              size={22}
              color="#33cc66"
              style={styles.snackbarIcon}
            />
            <Text style={styles.snackbarText}>
              Sensor {sensor ? "atualizado" : "cadastrado"} com sucesso!
            </Text>
          </View>
        </Snackbar>

        <Dialog
          visible={showConfirmSave}
          onDismiss={() => setShowConfirmSave(false)}
        >
          <Dialog.Title>Confirmar Salvar</Dialog.Title>
          <Dialog.Content>
            <Text>
              Tem certeza que deseja{" "}
              {sensor ? "salvar as alterações" : "cadastrar o sensor"}?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirmSave(false)}>Cancelar</Button>
            <Button
              onPress={async () => {
                setShowConfirmSave(false);
                await handleSensorRegistration();
              }}
            >
              Confirmar
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={showConfirmDelete}
          onDismiss={() => setShowConfirmDelete(false)}
        >
          <Dialog.Title>Confirmar Exclusão</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza que deseja excluir este sensor?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              onPress={async () => {
                setShowConfirmDelete(false);
                await handleDeleteSensor();
              }}
              textColor="#FF575A"
            >
              Deletar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 120, // Ajuste para acomodar os botões fixos
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  circularImage: {
    width: 180,
    height: 180,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#648DDB",
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
  },
  placeholderImage: {
    tintColor: "#999",
    resizeMode: "contain",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chip: {
    margin: 5,
    marginTop: 7,
    padding: 2,
  },
  errorText: {
    color: "red",
    margin: 5,
  },
  snackbar: {
    backgroundColor: "#E7F9ED",
    borderRadius: 12,
  },
  snackbarContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  snackbarIcon: {
    marginRight: 8,
  },
  snackbarText: {
    color: "#219653",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
  buttonDelete: {
    marginRight: 8,
  },
  buttonSave: {
    flex: 2,
  },
  buttonContent: {
    height: 48,
  },
  fixedButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 60,
    backgroundColor: "#fff", // mesmo fundo do seu formulário
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee", // opcional, só pra separar visualmente
  },
});
