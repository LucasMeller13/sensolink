import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, DefaultTheme, Dialog, Divider, PaperProvider, Portal, Text, TextInput } from "react-native-paper";
import { signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { auth } from '../firebase-sdk';

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
                        right={
                            <TextInput.Icon 
                                icon={visibilityPassword ? "eye" : "eye-off"}
                                onPress={() => setVisibilityPassword(!visibilityPassword)}
                            />
                        }
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
                        right={
                            <TextInput.Icon 
                                icon={visibilityPassword ? "eye" : "eye-off"}
                                onPress={() => setVisibilityPassword(!visibilityPassword)}
                            />
                        }
                    />
                    
                    <Text>Registro</Text>
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