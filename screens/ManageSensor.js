import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Chip, DefaultTheme, Dialog, Divider, PaperProvider, Portal, Text, TextInput } from "react-native-paper";
import { signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { auth } from '../firebase-sdk';
import { useNavigation } from "@react-navigation/native";

const DATA_TYPES = ["float", "int", "string", "boolean"];
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, 
    primary: '#648DDB', 
  },
};

export default function ManageSensorView(){
    const [arrayOutputValues, setArrayOutputValues] = useState([])
    const [outputValue, setOutputValue] = useState('')

    function addOutputValues(value){
        if(!arrayOutputValues.includes(value) && value !== ''){
            setArrayOutputValues([...arrayOutputValues, value])
            setOutputValue('')
        }
    }

    function removeOutputValues(value){
        setArrayOutputValues(arrayOutputValues.filter(item => item !== value))
    }

    return (
        <PaperProvider theme={theme}>
            <View>
                <TextInput 
                    label='Nome do sensor'
                    mode="outlined"
                />

                <TextInput 
                    label='Descrição ou informações adicionais'
                    mode="outlined"
                />

                <TextInput 
                    label='Frequência dos dados (em segundos)'
                    mode="outlined"
                    autoCapitalize="none"
                    keyboardType="numeric"
                />

                <TextInput 
                    label='Nome do dado (e.g, temperatura, humidade)'
                    value={outputValue}
                    onChangeText={setOutputValue}
                    mode="outlined"
                    autoCapitalize="none"
                    right={<TextInput.Icon icon="plus" onPress={() => addOutputValues(outputValue)} />}
                />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
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
                


            </View>
        </PaperProvider>
    )
}