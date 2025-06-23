import { getAuth } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import {
  collection,
  where,
  getDocs,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase-sdk";
import { Dropdown, MultiSelectDropdown } from 'react-native-paper-dropdown';
import { PaperProvider, TextInput, Switch } from 'react-native-paper';

const OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const MULTI_SELECT_OPTIONS = [
  { label: 'White', value: 'white' },
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Orange', value: 'orange' },
];

export default function ManageDashboardView() {
  const [sensorData, setSensorData] = useState([]);
  const [habilitarScroll, setHabilitarScroll] = useState(true);
  const [SensorIds, setSensorIds] = useState([]);
  const [enableUse, setEnableUse] = useState(false);
  const auth_user = getAuth();
  const [now, setNow] = useState(Date.now());
  const [selectedColors, setSelectedColors] = useState([]); 
  const [titleName, setTitleName] = useState("")
  const [showEdit, setShowEdit] = useState(true)


  // Popula array sensors com sensor_id
  useEffect(() => {
    const userId = auth_user.currentUser.uid;
    const q = query(collection(db, "sensors"), where("user_id", "==", userId));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const results = [];
      querySnapshot.forEach((doc) => {
        const sensorData = doc.data();
        const sensorID = doc.id;
        if (sensorData && sensorID) {
          results.push(sensorID);
        }
      });
      setSensorIds(results); 
    });
    
    return () => unsubscribe();
  }, [auth_user]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      // nova render a cada 5s
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PaperProvider>
      <Switch
        value={showEdit}
        onValueChange={setShowEdit}
        color='#648DDB'
      />
      {!showEdit && (<View style={styles.containerDrop}>
        <Dropdown
          label="Selecionar gráficos/KPIs..."
          options={OPTIONS}
          disabled={enableUse}
        />
        <TextInput 
          label="Título do gráfico..."
          mode="flat"
          value={titleName}
          onChangeText={setTitleName}
        />
        <MultiSelectDropdown
          label="Selecionar sensor..."
          options={MULTI_SELECT_OPTIONS}
          disabled={enableUse}
          value={selectedColors}
          onSelect={setSelectedColors}
        />
        <MultiSelectDropdown
          label="Selecionar campos..."
          options={MULTI_SELECT_OPTIONS}
          disabled={enableUse}
          value={selectedColors}
          onSelect={setSelectedColors}
        />
      </View>)}
      <View style={styles.container}>
        <View style={styles.chartContainer}>
        <Text>Gráfico de Sensor</Text>
          <LineChart
            data={sensorData}
            scrollToEnd
            width={Dimensions.get('window').width * 0.68} 
            height={200}                                 
            spacing={50}                                  
            color="#007BFF"
            dataPointsColor="#007BFF"
            dataPointsRadius={4}
          />
        </View>
        <Text>{SensorIds}</Text>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333'
  },
  containerDrop:{
    margin:10
  }
});