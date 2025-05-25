import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Chip, DefaultTheme, Dialog, Divider, PaperProvider, Portal, Snackbar, Text, TextInput } from "react-native-paper";
import { getAuth} from "firebase/auth";
import { auth, db } from '../firebase-sdk';
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection } from "firebase/firestore";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, 
    primary: '#648DDB', 
  },
};

export default function ManageSensorView(){
    const [arrayOutputValues, setArrayOutputValues] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [frequency, setFrequency] = useState('')
    const [outputValue, setOutputValue] = useState('')
    const [error, setError] = useState('')
    const [snackbarVisible, setSnackbarVisible] = useState(false)

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

    async function handleSensorRegistration(){
        const dados = {
            name: name,
            description: description,
            frequency: frequency,
            output_values: arrayOutputValues,
            created_at: new Date,
            updated_at: new Date,
            user_id: auth_user.currentUser.uid
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

        try{
            await addDoc(collection(db,'sensors'),dados)
            setError('')
            setSnackbarVisible(true)
        }catch (error){
            setError(error)
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
                    />

                    <TextInput 
                        label='Descrição ou informações adicionais'
                        mode="outlined"
                        value={description}
                        onChangeText={setDescription}
                    />

                    <TextInput 
                        label='Frequência dos dados (em segundos)'
                        mode="outlined"
                        autoCapitalize="none"
                        keyboardType="numeric"
                        value={frequency}
                        onChangeText={setFrequency}
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
                    />
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' , marginBottom: 10}}>
                        {arrayOutputValues.map(item => (
                            <Chip 
                                key={item}
                                mode="flat"
                                onClose={() => removeOutputValues(item)}
                                style={{margin:5, marginTop:7 ,padding:2}}
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
                                <Text style={{ color: "#219653" }}>Sensor cadastrado com sucesso!</Text>
                            </View>
                        </Snackbar>
                    </Portal>
                    
                    <Button
                        mode="contained"
                        onPress={() => handleSensorRegistration()}
                        contentStyle={{height:48}}
                    >
                        Salvar
                    </Button>


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