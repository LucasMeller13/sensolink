import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, DefaultTheme, Divider, PaperProvider, Text, TextInput } from "react-native-paper";

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

    const handleDefaultLogin = () => {

    }

    const handleGoogleLogin = () => {

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
                    secureTextEntry={!visibilityPassword}
                    right={
                        <TextInput.Icon 
                            icon={visibilityPassword ? "eye" : "eye-off"}
                            onPress={() => setVisibilityPassword(!visibilityPassword)}
                        />
                    }
                />

                <TouchableOpacity>
                    <Text>Esqueceu a senha?</Text>
                </TouchableOpacity>

                <Button
                    mode="contained"
                    onPress={handleDefaultLogin}
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