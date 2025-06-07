import { useState, useLayoutEffect, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { Button, DefaultTheme, Dialog, Divider, PaperProvider, Portal, Text, TextInput } from "react-native-paper";
import { signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { collection, where, getDocs, query,onSnapshot } from "firebase/firestore";
import { auth, db } from '../firebase-sdk';
import { getAuth} from "firebase/auth";
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, 
    primary: '#648DDB', 
  },
}

export default function SensorView(){
    const [sensors, setSensors] = useState([])
    const navigation = useNavigation()
    const auth_user = getAuth()
    const [now, setNow] = useState(Date.now())
    const [sortBy, setSortBy] = useState('name')
    const [sortDirection, setSortDirection] = useState('asc')

    function getSensorStatus(sensor) {
        const freqSecs = Number(sensor.frequency)
        const created_at = new Date(sensor.created_at.seconds * 1000)
        const lastUpdate = new Date(sensor.updated_at.seconds * 1000)
        const now = new Date()
        const diffSecs = (now - lastUpdate) / 1000
            
        if ((diffSecs > 1.5 * freqSecs) || ((lastUpdate - created_at)/1000 < 10)) {
            return { text: "Offline", color: "#FF575A" }
        } else {
            return { text: "Online", color: "#31D728" }
        }
    }

    useEffect(() => {
    const interval = setInterval(() => {
        setNow(Date.now())
    // nova render a cada 5s
    }, 5000)

    return () => clearInterval(interval)
    }, [])


    useEffect(() => {
        const userId = auth_user.currentUser.uid
        const q = query(
            collection(db, "sensors"),
            where("user_id", "==", userId)
        )

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const results = []
            querySnapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() })
            })
            setSensors(results)
        })

        return () => unsubscribe()
    }, [auth_user])


    useLayoutEffect(() => {
        navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('ManageSensorView')}>
            <Feather style={{paddingRight:20, paddingTop:7}} name="plus-square" size={30} color="#648DDB" />
            </TouchableOpacity>
        ),
        })
    }, [navigation])

    function sensorCard(sensor,status,handleCardPress){
        return (
            <TouchableOpacity key={sensor.id} onPress={() => handleCardPress(sensor)} activeOpacity={0.8} >
                <View style={styles.card}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Text style={styles.title}>{sensor.name || "Sem nome"}</Text>
                    <Text style={{ ...styles.status, color: status.color }}>{status.text}</Text>
                </View>
                <Text style={styles.desc}>
                    {sensor.description && sensor.description.trim() !== ""
                    ? sensor.description
                    : "Sem descrição."}
                </Text>
                <Text style={styles.lastData}>
                    Data do último dado recebido:{" "}
                    {sensor.updated_at
                    ? new Date(sensor.updated_at.seconds * 1000).toLocaleString("pt-BR", { hour12: false })
                    : "--"}
                </Text>
                </View>
            </TouchableOpacity>
            )
    }

    function handleCardPress(sensor){
        navigation.navigate('ManageSensorView', { sensor })
    }

    function getSortedSensors() {
        let sorted = [...sensors]

        if (sortBy === 'name') {
            sorted.sort((a, b) => {
            const aName = (a.name || '').toLowerCase()
            const bName = (b.name || '').toLowerCase()
            if (aName < bName) return sortDirection === 'asc' ? -1 : 1
            if (aName > bName) return sortDirection === 'asc' ? 1 : -1
            return 0
            })
        } else if (sortBy === 'updated_at') {
            sorted.sort((a, b) => {
            const aTime = a.updated_at?.seconds || 0
            const bTime = b.updated_at?.seconds || 0
            return sortDirection === 'asc' ? aTime - bTime : bTime - aTime
            })
    }

    return sorted
    }

    return (
        <PaperProvider theme={theme}>
            <ScrollView contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 4 }}>
                <View style={{ flexDirection: "row",justifyContent: 'flex-end',alignItems: 'center',}}>
                    <Button 
                        mode={sortBy === 'name' ? "contained" : "outlined"} 
                        style={styles.button_order}
                        onPress={() => setSortBy('name')}
                    >Alfabética</Button>

                    <Button 
                        mode={sortBy === 'updated_at' ? "contained" : "outlined"} 
                        style={styles.button_order}
                        onPress={() => setSortBy('updated_at')}
                    >Última atualização</Button>

                    <Button 
                        icon={sortDirection === 'asc' ? "arrow-up" : "arrow-down"}
                        compact
                        onPress={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    />
                </View>

                {getSortedSensors().length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 48, color: '#999', fontSize: 15 }}>
                        Nenhum sensor cadastrado no momento.
                    </Text>
                ) : (
                    getSortedSensors().map(sensor => {
                        const status = getSensorStatus(sensor)
                        return sensorCard(sensor, status, handleCardPress)
                    })
                )}

            </ScrollView>
        </PaperProvider>
    )
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    flex: 1,
    marginRight: 6,
  },
  status: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "flex-start",
  },
  desc: {
    fontSize: 14,
    color: "#444",
    marginTop: 2,
    marginBottom: 8,
  },
  lastData: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
  },
  button_order: {
    marginRight: 4,
    borderRadius: 4,
    padding:0
  }
})
