import { getAuth } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
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
import { PaperProvider, TextInput, Switch, Button, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#648DDB",
  },
};

export default function ManageDashboardView() {
  const CHART_TYPES = [
    {label: 'Gráfico de linha', value: 'line'},
    // {label: 'KPI', value: 'kpi'}
  ]

  const [sensorData, setSensorData] = useState([]);
  const [habilitarScroll, setHabilitarScroll] = useState(true);
  const [SensorIds, setSensorIds] = useState([]);
  const [availableSensors, setAvailableSensors] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [enableUse, setEnableUse] = useState(false);
  const auth_user = getAuth();
  const [now, setNow] = useState(Date.now());
  const [selectedColors, setSelectedColors] = useState([]); 
  const [showEdit, setShowEdit] = useState(true)

  const [titleName, setTitleName] = useState("")
  const [choosedGraph, setChoosedGraph] = useState([])
  const [choosedSensors, setChoosedSensors] = useState([])
  const [choosedFields, setChoosedFields] = useState([])
  const [confirmedPlots, setConfirmedPlots] = useState([]);

  // Popula array sensors com sensor_id
  useEffect(() => {
    const userId = auth_user.currentUser.uid;
    const q = query(collection(db, "sensors"), where("user_id", "==", userId));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const results = [];
      const available_sensors = [];
      const final_json = []

      querySnapshot.forEach((doc) => {
        const sensorData = doc.data();
        const sensorID = doc.id;

        if (sensorData && sensorID) {
          results.push(sensorID);
          available_sensors.push({
            label: sensorID,
            value: sensorID
          })

          if (sensorData.output_values && Array.isArray(sensorData.output_values)) {
            const available_fields = [];
            sensorData.output_values.forEach((fieldItem) => {
              if (typeof fieldItem === 'string' && fieldItem.length > 0) {
                available_fields.push({
                  label: fieldItem, 
                  value: fieldItem 
                });
              }
            });
            final_json.push({
              id:sensorID,
              fields:available_fields
            })
          }
        }
      });

      setSensorIds(results)
      setAvailableSensors(available_sensors)
      setAvailableFields(final_json)
      console.log(final_json.find(item => item.id === "Q96sGnPhDbrnakRe1dVg").fields)
      console.log(available_sensors)
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

  const handleConfirmPlot = () => {
  const newPlot = {
    id: Date.now(),
    graphType: choosedGraph,
    title: titleName,
    sensor: choosedSensors,
    fields: choosedFields,
  };
  setConfirmedPlots([...confirmedPlots, newPlot]);

  setChoosedGraph([]);
  setTitleName("");
  setChoosedSensors([]);
  setChoosedFields([]);
};

const handleDeletePlot = (idToDelete) => {
  setConfirmedPlots(confirmedPlots.filter(plot => plot.id !== idToDelete));
};

  return (
    <PaperProvider theme={theme}>
    <ScrollView>
    <View>
      <Text>Habilitar criação</Text>
      <Switch
        value={showEdit}
        onValueChange={setShowEdit}
        color='#648DDB'
      />
    </View>

    {showEdit && (
      <View style={styles.containerDrop}>
        <Text>Criação de Gráficos/KPIs</Text>
        <Dropdown
          label="Selecionar gráficos/KPIs..."
          options={CHART_TYPES}
          mode='outlined'
          disabled={enableUse}
          value={choosedGraph}
          onSelect={setChoosedGraph}
        />
        <TextInput
          label="Título do gráfico..."
          mode="outlined"
          value={titleName}
          onChangeText={setTitleName}
        />
        <Dropdown
          label="Selecionar sensor..."
          mode='outlined'
          options={availableSensors}
          disabled={enableUse}
          value={choosedSensors}
          onSelect={setChoosedSensors}
        />
        <Dropdown 
          label="Selecionar campos..."
          mode='outlined'
          options={availableFields.find(item => item.id === choosedSensors) ? availableFields.find(item => item.id === choosedSensors).fields : []}
          disabled={enableUse}
          value={choosedFields}
          onSelect={setChoosedFields}
        />
        <Button
          mode="contained"
          onPress={handleConfirmPlot}
        >
          Confirmar
        </Button>
      </View>
    )}

    {confirmedPlots.map((plot) => (
      <View key={plot.id} style={styles.chartWrapper}>
        <View style={styles.chartContainer}>
          <View style={styles.titleContainer}> 
            <Text style={styles.chartTitle}>{plot.title || "Gráfico de Sensor"}</Text>
            <TouchableOpacity onPress={() => handleDeletePlot(plot.id)} style={styles.deleteIcon}>
              <Icon name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
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
      </View>
    ))}

    </ScrollView>
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