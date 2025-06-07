import { useState, useLayoutEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, DefaultTheme, Dialog, Divider, PaperProvider, Portal, Text, TextInput } from "react-native-paper";
import { signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { collection, where, getDocs, query } from "firebase/firestore";
import { auth, db } from '../firebase-sdk';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";

export default function SensorView(){
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('ManageSensorView')}>
            <Feather style={{paddingRight:20, paddingTop:7}} name="plus-square" size={30} color="#648DDB" />
            </TouchableOpacity>
        ),
        });
    }, [navigation]);
    return (
        <View>
            <Text>salve sensor</Text>
        </View>
    )
}