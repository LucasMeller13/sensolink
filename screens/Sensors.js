import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, DefaultTheme, Dialog, Divider, PaperProvider, Portal, Text, TextInput } from "react-native-paper";
import { signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { auth } from '../firebase-sdk';
import { useNavigation } from "@react-navigation/native";

export default function SensorView(){
    return (
        <View>
            <Text>salve sensor</Text>
        </View>
    )
}