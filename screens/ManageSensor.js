import { useEffect, useState } from "react";
import theme from "../styles/theme";
import styles from "../styles/globalStyles";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Keyboard,
} from "react-native";

import {
  Button,
  PaperProvider,
  Portal,
} from "react-native-paper";

import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import { db } from "../firebase-sdk";
import { useNavigation } from "@react-navigation/native";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

import AppTextInput from "../components/AppTextInput";
import OutputChipList from "../components/OutputChipList";
import ConfirmDialog from "../components/ConfirmDialog";
import SnackbarMessage from "../components/SnackbarMessage";
import ImagePickerBox from "../components/ImagePickerBox";

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
      }, 1500);
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
    if (!sensor?.id) return;
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
      name,
      description,
      frequency,
      output_values: arrayOutputValues,
      user_id: auth_user.currentUser.uid,
    };

    if (!sensor) {
      dados.created_at = new Date();
      dados.updated_at = new Date();
    }

    if (!name) {
      setError("Preencha o campo de nome.");
      return;
    } else if (!frequency) {
      setError("Preencha o campo de frequência.");
      return;
    } else if (isNaN(Number(frequency)) || Number(frequency) <= 0) {
      setError("O campo frequência deve ser um número maior que zero.");
      return;
    } else if (arrayOutputValues.length === 0) {
      setError("Preencha pelo menos um nome do dado.");
      return;
    } else if (description.length > 150) {
      setError("Descrição maior que 150 caracteres.");
      return;
    }

    try {
      if (sensor?.id) {
        await updateDoc(doc(collection(db, "sensors"), sensor.id), dados);
      } else {
        await addDoc(collection(db, "sensors"), dados);
      }
      setError("");
      setSnackbarVisible(true);
    } catch (error) {
      setError(error.message || String(error));
      setSnackbarVisible(true);
    }
  }

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Permissão de galeria negada.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
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
            <ImagePickerBox
              imageUri={imageUri}
              onPick={handlePickImage}
              onRemove={() => setImageUri(null)}
            />

            <AppTextInput
              label="Nome do sensor"
              value={name}
              onChangeText={setName}
              disabled={snackbarVisible}
            />

            <AppTextInput
              label="Descrição ou informações adicionais"
              value={description}
              onChangeText={setDescription}
              disabled={snackbarVisible}
              multiline
            />

            {sensor?.id && (
              <AppTextInput
                label="ID do sensor"
                value={sensor.id}
                disabled
                right={{
                  icon: "content-copy",
                  onPress: () => Clipboard.setStringAsync(sensor.id),
                }}
              />
            )}

            <AppTextInput
              label="Frequência dos dados (em segundos)"
              value={frequency}
              onChangeText={setFrequency}
              keyboardType="numeric"
              disabled={snackbarVisible}
            />

            <AppTextInput
              label="Nome do dado (e.g, temperatura, humidade)"
              value={outputValue}
              onChangeText={setOutputValue}
              right={{
                icon: "plus",
                onPress: () => addOutputValues(outputValue),
              }}
              onSubmitEditing={() => addOutputValues(outputValue)}
              disabled={snackbarVisible}
            />

            <OutputChipList
              items={arrayOutputValues}
              onRemove={removeOutputValues}
              disabled={snackbarVisible}
            />

            {error !== "" && <Text style={styles.errorText}>{error}</Text>}
          </ScrollView>

          <View style={styles.fixedButtons}>
            {sensor?.id && (
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

      <Portal>
        <SnackbarMessage
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          message={`Sensor ${sensor ? "atualizado" : "cadastrado"} com sucesso!`}
        />

        <ConfirmDialog
          visible={showConfirmSave}
          onCancel={() => setShowConfirmSave(false)}
          onConfirm={async () => {
            setShowConfirmSave(false);
            await handleSensorRegistration();
          }}
          title="Confirmar Salvar"
        >
          Tem certeza que deseja {sensor ? "salvar as alterações" : "cadastrar o sensor"}?
        </ConfirmDialog>

        <ConfirmDialog
          visible={showConfirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
          onConfirm={async () => {
            setShowConfirmDelete(false);
            await handleDeleteSensor();
          }}
          title="Confirmar Exclusão"
          confirmText="Deletar"
        >
          Tem certeza que deseja excluir este sensor?
        </ConfirmDialog>
      </Portal>
    </PaperProvider>
  );
}
