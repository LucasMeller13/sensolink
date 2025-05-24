import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, DefaultTheme, Dialog, Divider, PaperProvider, Portal, Text, TextInput } from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { auth } from '../firebase-sdk';
import { useNavigation } from "@react-navigation/native";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, 
    primary: '#648DDB', 
  },
};

export default function RegisterUserScreen(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [firstPassword, setFirstPassword] = useState('');
    const [secondPassword, setSecondPassword] = useState('');
    const [visibilityPassword, setVisibilityPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const navigation = useNavigation()

    useEffect(() => {
        if (successMessage !== ''){
            const timeout = setTimeout(() => {
                            navigation.navigate('Login')
                        }, 1200)
            return () => clearTimeout(timeout)               
        }
    })

    async function handleRegistrationUser(){
        if (firstPassword !== secondPassword){
            setErrorMessage('As senhas não são iguais.')
            return
        }

        try{
            const credential = await createUserWithEmailAndPassword(auth, email, firstPassword)
            const user = credential.user
            await updateProfile(user, {displayName:name})
            setErrorMessage('')
            setSuccessMessage('Usuário cadastrado com sucesso!')
        }catch (error){
            switch (error.code){
                case 'auth/email-already-in-use':
                    setErrorMessage('E-mail já está em uso.')
                    break
                case 'auth/invalid-email':
                    setErrorMessage('E-mail inválido.')
                    break
                case 'auth/missing-email':
                    setErrorMessage('Preencher o campo de e-mail.')
                    break
                case 'auth/weak-password':
                    setErrorMessage('Senha fraca, tem que possuir pelo menos 6 dígitos.')
                    break
                default:
                    setErrorMessage('Erro na aplicação.')
            }
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
                    <Image source={require('../assets/sensolink-complete.png')} style={styles.sensolinkLogo}/>

                    <TextInput 
                        label='Nome'
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                    />

                    <TextInput 
                        label='Email'
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput 
                        label='Senha'
                        value={firstPassword}
                        onChangeText={setFirstPassword}
                        mode="outlined"
                        autoCapitalize="none"
                        secureTextEntry={!visibilityPassword}
                        returnKeyType="done"
                        onSubmitEditing={[]}
                    />

                    <TextInput 
                        label='Repita a senha'
                        value={secondPassword}
                        onChangeText={setSecondPassword}
                        mode="outlined"
                        autoCapitalize="none"
                        secureTextEntry={!visibilityPassword}
                        returnKeyType="done"
                        onSubmitEditing={[]}
                    />

                    {errorMessage !== '' && (
                        <Text style={{color:'red'}}>{errorMessage}</Text>
                    )}

                    {successMessage !== '' && (
                        <Text style={{color:'green'}}>{successMessage}</Text>
                    )}
                    
                    <Button
                    mode="contained"
                    onPress={handleRegistrationUser}
                    contentStyle={{height:48}}
                    >
                        Cadastrar
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
        flexGrow:1,
        padding:24,
        paddingBottom:40,
        justifyContent:"center",
    }
})