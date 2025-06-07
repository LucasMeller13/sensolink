import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View, Keyboard } from "react-native";
import { Button, Chip, DefaultTheme, Dialog, Divider, PaperProvider, Portal, Snackbar, Text, TextInput } from "react-native-paper";
import { getAuth} from "firebase/auth";
import { auth, db } from '../firebase-sdk';
import { useNavigation } from "@react-navigation/native";
import { doc, updateDoc, addDoc, collection, deleteDoc } from "firebase/firestore";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, 
    primary: '#648DDB', 
  },
};

export default function ManageSensorView(){
    const route = useRoute();
    const { sensor } = route.params || {};
    const navigation = useNavigation();

    const [arrayOutputValues, setArrayOutputValues] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [frequency, setFrequency] = useState('')
    const [outputValue, setOutputValue] = useState('')
    const [error, setError] = useState('')
    const [snackbarVisible, setSnackbarVisible] = useState(false)

    useEffect(() => {
        if (sensor) {
        setName(sensor.name || '');
        setDescription(sensor.description || '');
        setFrequency(sensor.frequency || '');
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

    const auth_user = getAuth()

    function addOutputValues(value){
        value = value.trim()
        if(!arrayOutputValues.includes(value) && value !== ''){
            setArrayOutputValues([...arrayOutputValues, value])
        }
        setOutputValue('')
    }

    function removeOutputValues(value){
        setArrayOutputValues(arrayOutputValues.filter(item => item !== value))
    }

    async function handleDeleteSensor() {
        if (!sensor || !sensor.id) return;
        try {
            await deleteDoc(doc(collection(db, 'sensors'), sensor.id));
            setSnackbarVisible(true);
            setError('');
            if (navigation.canGoBack()) navigation.goBack();
        } catch (error) {
            setError(error.message || String(error));
            setSnackbarVisible(true);
        }
    }

    async function handleSensorRegistration(){
        const dados = {
            name: name,
            description: description,
            frequency: frequency,
            output_values: arrayOutputValues,
            user_id: auth_user.currentUser.uid
        }

        if (!sensor) {
            dados.created_at = new Date();
            dados.updated_at = new Date();
        }

        if (name === ''){
            setError('Preencha o campo de nome.')
            return
        }else if (frequency === ''){
            setError('Preencha o campo de frequência.')
            return
        } else if (arrayOutputValues.length == 0){
            setError('Preencha pelo menos um nome do dado.')
            return
        }

        try {
            if (sensor && sensor.id) {
                await updateDoc(doc(collection(db, 'sensors'), sensor.id), dados);
                setError('');
                setSnackbarVisible(true);
            } else {
                await addDoc(collection(db, 'sensors'), dados);
                setError('');
                setSnackbarVisible(true);
            }
        } catch (error) {
            setError(error.message || String(error));
            setSnackbarVisible(true);
        }
    }

    return (
        <PaperProvider theme={theme}>
            <KeyboardAvoidingView
                style={{flex:1}} 
                behavior={Platform.OS === 'ios' ? "padding" : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView 
                contentContainerStyle={styles.container} 
                keyboardShouldPersistTaps='handled'
                >
                    <TextInput 
                        label='Nome do sensor'
                        mode="outlined"
                        value={name}
                        onChangeText={setName}
                        disabled={snackbarVisible}
                    />

                    <TextInput 
                        label='Descrição ou informações adicionais'
                        mode="outlined"
                        value={description}
                        onChangeText={setDescription}
                        disabled={snackbarVisible}
                    />

                    <TextInput 
                        label='Frequência dos dados (em segundos)'
                        mode="outlined"
                        autoCapitalize="none"
                        keyboardType="numeric"
                        value={frequency}
                        onChangeText={setFrequency}
                        disabled={snackbarVisible}
                    />

                    <TextInput 
                        label='Nome do dado (e.g, temperatura, humidade)'
                        value={outputValue}
                        onChangeText={setOutputValue}
                        mode="outlined"
                        autoCapitalize="none"
                        right={<TextInput.Icon icon="plus" onPress={() => addOutputValues(outputValue)} />}
                        returnKeyType="done"
                        onSubmitEditing={() => addOutputValues(outputValue)}
                        disabled={snackbarVisible}
                    />
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' , marginBottom: 10}}>
                        {arrayOutputValues.map(item => (
                            <Chip 
                                key={item}
                                mode="flat"
                                onClose={() => removeOutputValues(item)}
                                style={{margin:5, marginTop:7 ,padding:2}}
                                disabled={snackbarVisible}
                            >
                                {item}
                            </Chip>
                        ))}
                    </View>

                    {error !== '' && (
                        <Text style={{color:'red', margin:5}}>{error}</Text>
                    )}

                    <Portal>
                        <Snackbar
                            visible={snackbarVisible}
                            onDismiss={() => setSnackbarVisible(false)}
                            duration={2000}
                            style={{ backgroundColor: '#E7F9ED', borderRadius: 12 }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="check-circle" size={22} color="#33cc66" style={{ marginRight: 8 }} />
                                <Text style={{ color: "#219653" }}>Sensor {sensor? "atualizado" : "cadastrado"} com sucesso!</Text>
                            </View>
                        </Snackbar>
                    </Portal>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                        {sensor && sensor.id && (
                            <Button
                                mode="contained"
                                onPress={handleDeleteSensor}
                                buttonColor="#FF575A"
                                textColor="#fff"
                                style={{ flex: 1, marginRight: 8 }}
                                contentStyle={{ height: 48 }}
                                disabled={snackbarVisible}
                            >
                                Deletar
                            </Button>
                        )}

                        <Button
                            mode="contained"
                            onPress={() => {
                                Keyboard.dismiss();
                                handleSensorRegistration();}}
                            contentStyle={{ height: 48 }}
                            style={{ flex: 2 }}
                            disabled={snackbarVisible}
                        >
                            Salvar
                        </Button>
                    </View>


                </ScrollView>
            </KeyboardAvoidingView>
        </PaperProvider>
    )
}



const styles = StyleSheet.create({
    sensolinkLogo: {
        width:100,
        height:100
    },
    container : {
        flex:1,
        padding:24,
        justifyContent:"center",
    }
})