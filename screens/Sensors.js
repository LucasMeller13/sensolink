import { useState, useLayoutEffect, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { Button, DefaultTheme, Dialog, Divider, PaperProvider, Portal, Text, TextInput } from "react-native-paper";
import { signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { collection, where, getDocs, query,onSnapshot } from "firebase/firestore";
import { auth, db } from '../firebase-sdk';
import { getAuth} from "firebase/auth";
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

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
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                onPress={async () => {
                    if (sensors.length === 0) {
                        alert('Nenhum sensor para exportar.')
                        return
                    }
                    try {
                        await exportSensorsAndShare(sensors)
                    } catch (e) {
                        alert('Erro ao exportar: ' + e.message)
                    }
                }}
                >
                    <Feather
                        style={{ paddingRight: 18, paddingTop: 9 }}
                        name="share-2"
                        size={27}
                        color="#648DDB"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ManageSensorView')}>
                    <Feather style={{ paddingRight: 20, paddingTop: 7 }} name="plus-square" size={30} color="#648DDB" />
                </TouchableOpacity>
            </View>
            ),
        })
    }, [navigation, sensors])

    async function exportSensorsAndShare(sensors) {
        const csv = sensorsToCSV(sensors)
        const filename = "sensors.csv"
        const fileUri = FileSystem.cacheDirectory + filename
        await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 })
        await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Compartilhar dados dos sensores',
            UTI: 'public.comma-separated-values-text'
        })
    }

    function sensorsToCSV(sensors) {
        const header = ['ID', 'Name', 'Description', 'Output Values', 'Last Update']
        const lines = sensors.map(sensor => {
            const outputValues = (sensor.output_values || []).join('; ')
            const lastUpdate = sensor.updated_at
            ? new Date(sensor.updated_at.seconds * 1000).toLocaleString('pt-BR', { hour12: false })
            : ''
            const csvEscape = v => `"${(v ?? '').toString().replace(/"/g, '""')}"`
            return [
            csvEscape(sensor.id),
            csvEscape(sensor.name),
            csvEscape(sensor.description),
            csvEscape(outputValues),
            csvEscape(lastUpdate)
            ].join(',')
        })
        return [header.join(','), ...lines].join('\n')
    }

    function sensorCard(sensor,status,handleCardPress){
        return (
        <TouchableOpacity key={sensor.id} onPress={() => handleCardPress(sensor)} activeOpacity={0.8}>
            <View style={styles.card}>
                <View style={{ flexDirection: "row" }}>
                    {/* LEFT COLUMN */}
                    <View style={{ flex: 4, paddingRight: 12, justifyContent: 'center' }}>
                        <Text style={styles.title}>{sensor.name}</Text>

                        <Text style={styles.desc}>
                            <Text style={{ fontWeight: 'bold' }}>Descrição: </Text>
                            {sensor.description && sensor.description.trim() !== ""
                            ? sensor.description
                            : "Sem descrição."}
                        </Text>

                        <Text style={{ fontSize: 12, marginTop: 5 }}>
                            <Text style={{ fontWeight: "bold"}}>ID: </Text>
                            {sensor.id}
                        </Text>

                        <Text style={{ fontSize: 12, marginTop: 4 }}>
                            <Text style={{ fontWeight: 'bold' }}>Tipos de dados: </Text>
                            {(sensor.output_values || []).join(', ') || 'Nenhum'}
                        </Text>

                        <Text style={styles.lastData}>
                            Última atualização:{" "}
                            {sensor.updated_at
                            ? new Date(sensor.updated_at.seconds * 1000).toLocaleString("pt-BR", { hour12: false })
                            : "--"}
                        </Text>
                    </View>

                    {/* VERTICAL DIVIDER */}
                    <View style={{
                    width: 1.3,              
                    backgroundColor: '#DDD',
                    marginVertical: 8,
                    margin: 10        
                    }} />
                    
                    {/* RIGHT COLUMN */}
                    <View style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Text style={{ ...styles.status, color: status.color }}>{status.text}</Text>
                    </View>
                </View>
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
    fontSize: 20,
    alignSelf: "flex-start",
  },
  desc: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
    marginBottom: 0,
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
