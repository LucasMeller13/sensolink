import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, DefaultTheme, Dialog, Divider, PaperProvider, Portal, Text, TextInput } from "react-native-paper";
import { signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { auth } from '../firebase-sdk';
import { useNavigation } from "@react-navigation/native";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, 
    primary: '#648DDB', 
  },
};


export default function LoginScreen(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visibilityPassword, setVisibilityPassword] = useState(false);
    const [error, setError] = useState('')
    const [dialogVisible, setDialogVisible] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('')
    const [forgotMessage, setForgotMessage] = useState('')
    const [forgotError, setForgotError] = useState('')
    const navigation = useNavigation()

    const handleGoogleLogin = () => {

    }

    async function handleDefaultLogin(){
        try{
            await signInWithEmailAndPassword(auth, email, password)
            setError('')
            console.log('logou')
        }catch (error){
            switch(error.code){
                case 'auth/user-not-found':
                    setError('Usuário não encontrado.')
                    break;
                case 'auth/invalid-email':
                    setError('E-mail inválido.')
                    break;
                case 'auth/invalid-credential':
                    setError('Senha incorreta.')
                    break;
                default:
                    console.log(error.code)
                    setError('Erro na autenticação.')
            }
        }
    }

    async function handleSendResetPassword(){
        setForgotMessage('')
        setForgotError('')
        console.log(forgotEmail)
        try{
            await sendPasswordResetEmail(auth, forgotEmail)
            setForgotMessage('E-mail enviado! Verifique a sua caixa de entrada.')
        }catch (error){
            console.log(error)
            switch(error.code){
                case 'auth/user-not-found':
                    setForgotError('Usuário não encontrado.')
                    break;
                case 'auth/invalid-email':
                    setForgotError('E-mail inválido.')
                    break;
                default:
                    setForgotError('Erro ao enviar o e-mail.')
            } 
        }
    }

    return (
        <PaperProvider theme={theme}>
            <View style={styles.container}>
                <Image source={require('../assets/sensolink-complete.png')} style={styles.sensolinkLogo}/>

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
                        />
                    }
                />

                {error !== '' && (
                    <Text style={{color: 'red', marginVertical: 8}}>{error}</Text>
                    )}

                <TouchableOpacity onPress={() => {
                    setDialogVisible(true)
                    setForgotEmail(email)
                    setForgotMessage('')
                    setForgotError('')
                }}>
                    <Text>Esqueceu a senha?</Text>
                </TouchableOpacity>

                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Redefinir senha</Dialog.Title>
                        <Dialog.Content>
                            <TextInput 
                                label={'E-mail'}
                                value={forgotEmail}
                                onChangeText={setForgotEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {forgotMessage !== '' && (
                                <Text style={{color:'green', marginTop:0}}>{forgotMessage}</Text>
                            )}
                            {forgotError !== '' && (
                                <Text style={{color:'red', marginTop:0}}>{forgotError}</Text>
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
                    contentStyle={{height:48}}
                >
                    Continuar
                </Button>

                <View>
                    <Text>Não tem conta?</Text>
                    <TouchableOpacity>
                        <Text onPress={() => navigation.navigate('RegisterUser')}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <Divider style={{flex:1}} />
                        <Text>Ou</Text>
                    <Divider style={{flex:1}} />
                </View>

                <Button
                    mode="contained"
                    onPress={handleGoogleLogin}
                >
                    Login com o Google
                </Button>

            </View>
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