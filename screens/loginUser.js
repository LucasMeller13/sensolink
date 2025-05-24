import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, DefaultTheme, Divider, PaperProvider, Text, TextInput } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase-sdk';

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

    const handleGoogleLogin = () => {

    }

    async function handleDefaultLogin(email, senha){
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, senha)
            setError('')
            const user = userCredential.user
            console.log('salve ', user)
        }catch (error){
            setError('erro')
            console.log('Erro ao fazer login:', error.code, error.message);
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

                <TouchableOpacity>
                    <Text>Esqueceu a senha?</Text>
                </TouchableOpacity>

                <Button
                    mode="contained"
                    onPress={() => handleDefaultLogin(email, password)}
                    contentStyle={{height:48}}
                >
                    Continuar
                </Button>

                <View>
                    <Text>Não tem conta?</Text>
                    <TouchableOpacity>
                        <Text>Cadastrar</Text>
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