import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import TopoDecorativo from '../components/TopoDecorativo';

export default function ExportarScreen({ navigation }) {
  const [numeroAnimal, setNumeroAnimal] = useState('');
  const [dataInicial, setDataInicial] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);

  const exportarCSV = async () => {
    try {
      let listaAnimais = [];

      if (numeroAnimal) {
        const q = query(
          collection(db, 'animais'),
          where('numero', '==', Number(numeroAnimal))
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          Alert.alert('Erro', 'Animal não encontrado.');
          return;
        }
        listaAnimais = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        const snapshot = await getDocs(collection(db, 'animais'));
        listaAnimais = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      let csv = 'Número do Animal,Data,Peso\n';
      let linhas = [];

      listaAnimais.forEach(animal => {
        const historico = Array.isArray(animal.peso) ? animal.peso : [];

        const filtrados = historico.filter(p => {
          const data = p.data.toDate();

          // Zera as horas para comparar apenas por data
          const dataSemHora = new Date(
            data.getFullYear(),
            data.getMonth(),
            data.getDate()
          );

          const inicio = dataInicial
            ? new Date(dataInicial.getFullYear(), dataInicial.getMonth(), dataInicial.getDate())
            : null;
          const fim = dataFinal
            ? new Date(dataFinal.getFullYear(), dataFinal.getMonth(), dataFinal.getDate())
            : null;

          return (
            (!inicio || dataSemHora >= inicio) &&
            (!fim || dataSemHora <= fim)
          );
        });

        filtrados.forEach(p => {
          linhas.push(`${animal.numero},${p.data.toDate().toLocaleDateString('pt-BR')},${p.peso}`);
        });
      });

      if (linhas.length === 0) {
        Alert.alert('Aviso', 'Nenhum registro encontrado.');
        return;
      }

      csv += linhas.join('\n');

      const path = `${FileSystem.documentDirectory}historico.csv`;
      await FileSystem.writeAsStringAsync(path, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(path);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      Alert.alert('Erro', 'Não foi possível exportar os dados.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F8FC' }}>
      <TopoDecorativo />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.rowBetween}>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Image
              source={require('../../assets/images/arrow-left.png')}
              style={styles.navIcon}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Exportar Histórico em CSV</Text>

        <TextInput
          style={styles.input}
          placeholder="Número do animal (opcional)"
          keyboardType="numeric"
          value={numeroAnimal}
          onChangeText={setNumeroAnimal}
        />

        <TouchableOpacity onPress={() => setShowInicio(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>
            Data Inicial: {dataInicial ? dataInicial.toLocaleDateString('pt-BR') : 'não definida'}
          </Text>
        </TouchableOpacity>

        {showInicio && (
          <DateTimePicker
            value={dataInicial || new Date()}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowInicio(false);
              if (date) setDataInicial(date);
            }}
          />
        )}

        <TouchableOpacity onPress={() => setShowFim(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>
            Data Final: {dataFinal ? dataFinal.toLocaleDateString('pt-BR') : 'não definida'}
          </Text>
        </TouchableOpacity>

        {showFim && (
          <DateTimePicker
            value={dataFinal || new Date()}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowFim(false);
              if (date) setDataFinal(date);
            }}
          />
        )}

        <TouchableOpacity style={styles.exportButton} onPress={exportarCSV}>
          <Text style={styles.exportText}>Exportar CSV</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
    marginBottom: 16,
  },
  navIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00000',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  dateButton: {
    backgroundColor: '#00B5D6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
  },
  exportButton: {
    backgroundColor: '#03527E',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  exportText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
