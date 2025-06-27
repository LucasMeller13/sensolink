import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import {
  Text,
  PaperProvider,
  TextInput,
  Button,
  DefaultTheme,
  Switch,
} from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';

import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase-sdk';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#648DDB',
  },
};

export default function ManageDashboardView() {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const [sensorData, setSensorData] = useState([]);
  const [showEdit, setShowEdit] = useState(true);

  const [titleName, setTitleName] = useState('');
  const [choosedGraph, setChoosedGraph] = useState([]);
  const [choosedSensor, setChoosedSensor] = useState('');
  const [choosedField, setChoosedField] = useState('');
  const [confirmedPlots, setConfirmedPlots] = useState([]);

  const [availableSensors, setAvailableSensors] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);

  const CHART_TYPES = [{ label: 'Gráfico de linha', value: 'line' }];

  // Carrega sensores do usuário
  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, 'sensors'), where('user_id', '==', userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const sensors = [];
      const fields = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sensorId = doc.id;
        sensors.push({ label: sensorId, value: sensorId });

        if (Array.isArray(data.output_values)) {
          fields.push({
            id: sensorId,
            values: data.output_values.map((v) => ({ label: v, value: v })),
          });
        }
      });

      setAvailableSensors(sensors);
      setAvailableFields(fields);
    });

    return () => unsubscribe();
  }, [userId]);

  // Ao confirmar gráfico, busca dados reais
  const handleConfirmPlot = async () => {
    if (!choosedSensor || !choosedField) return;

    const newPlot = {
      id: Date.now(),
      graphType: choosedGraph,
      title: titleName || `${choosedSensor} - ${choosedField}`,
      sensor: choosedSensor,
      field: choosedField,
    };

    try {
      const colRef = collection(db, `sensors/${choosedSensor}/readings`);
      const snapshot = await getDocs(colRef);

      const newData = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const value = data[choosedField];
        const timestamp = data.timestamp;

        if (typeof value === 'number' && timestamp?.seconds) {
          const date = new Date(timestamp.seconds * 1000);
          const hour = date.getHours().toString().padStart(2, '0');
          const minute = date.getMinutes().toString().padStart(2, '0');
          newData.push({
            value: parseFloat(value.toFixed(1)),
            label: `${hour}:${minute}`,
          });
        }
      });

      newData.sort((a, b) => a.label.localeCompare(b.label));
      setSensorData(newData);
      setConfirmedPlots([...confirmedPlots, newPlot]);

      // Limpa
      setTitleName('');
      setChoosedGraph([]);
      setChoosedSensor('');
      setChoosedField('');
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleDeletePlot = (idToDelete) => {
    setConfirmedPlots(confirmedPlots.filter((p) => p.id !== idToDelete));
    setSensorData([]);
  };

  return (
    <PaperProvider theme={theme}>
      <ScrollView>
        <View style={{ margin: 16 }}>
          <Text style={{ marginBottom: 8 }}>Habilitar criação</Text>
          <Switch value={showEdit} onValueChange={setShowEdit} color="#648DDB" />
        </View>

        {showEdit && (
          <View style={styles.containerDrop}>
            <Text style={styles.sectionTitle}>Criar gráfico</Text>
            <Dropdown
              label="Tipo de gráfico"
              options={CHART_TYPES}
              mode="outlined"
              value={choosedGraph}
              onSelect={setChoosedGraph}
            />
            <TextInput
              label="Título do gráfico"
              value={titleName}
              onChangeText={setTitleName}
              mode="outlined"
              style={{ marginVertical: 8 }}
            />
            <Dropdown
              label="Sensor"
              options={availableSensors}
              mode="outlined"
              value={choosedSensor}
              onSelect={setChoosedSensor}
            />
            <Dropdown
              label="Campo"
              options={
                availableFields.find((item) => item.id === choosedSensor)?.values || []
              }
              mode="outlined"
              value={choosedField}
              onSelect={setChoosedField}
            />
            <Button
              mode="contained"
              style={{ marginTop: 12 }}
              onPress={handleConfirmPlot}
              disabled={!choosedGraph || !choosedSensor || !choosedField}
            >
              Confirmar
            </Button>
          </View>
        )}

        {confirmedPlots.map((plot) => (
          <View key={plot.id} style={styles.chartWrapper}>
            <View style={styles.chartContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.chartTitle}>{plot.title}</Text>
                <TouchableOpacity onPress={() => handleDeletePlot(plot.id)}>
                  <Icon name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
              <LineChart
                data={sensorData}
                width={Dimensions.get('window').width * 0.9}
                height={200}
                spacing={40}
                color="#007BFF"
                dataPointsColor="#007BFF"
                dataPointsRadius={4}
                thickness={2}
                curveType="bezier"
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  containerDrop: {
    marginHorizontal: 16,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 10,
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
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
});
