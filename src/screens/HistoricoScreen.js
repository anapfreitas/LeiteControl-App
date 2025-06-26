import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import TopoDecorativo from '../components/TopoDecorativo';

export default function HistoricoScreen({ navigation }) {
  const [animais, setAnimais] = useState([]);
  const [animalExpandido, setAnimalExpandido] = useState(null);
  const [busca, setBusca] = useState('');

  useFocusEffect(
    useCallback(() => {
      const buscarAnimais = async () => {
        try {
          const snapshot = await getDocs(collection(db, 'animais'));
          const lista = snapshot.docs.map(doc => {
            const dados = doc.data();
            const pesos = Array.isArray(dados.peso) ? dados.peso : [];

            const pesosOrdenados = [...pesos].sort(
              (a, b) => new Date(b.data.toDate()) - new Date(a.data.toDate())
            );

            const pesoAtual = pesosOrdenados.length > 0 ? pesosOrdenados[0].peso : 'Sem registro';

            return {
              id: doc.id,
              numero: dados.numero,
              pesoAtual: pesoAtual,
              historico: pesosOrdenados,
            };
          });

          const ordenados = lista.sort((a, b) => a.numero - b.numero);

          setAnimais(ordenados);
        } catch (error) {
          console.error('Erro ao buscar animais:', error);
        }
      };

      buscarAnimais();
    }, [])
  );

  const toggleExpandir = (id) => {
    setAnimalExpandido(prevId => (prevId === id ? null : id));
  };

  // Filtra animal buscado (caso exista)
  const animaisFiltrados = busca
    ? animais.filter((a) => a.numero.toString().includes(busca))
    : animais;

  return (
    <View style={styles.container}>
      <TopoDecorativo />

      <View style={styles.rowBetween}>
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <Image
            source={require('../../assets/images/arrow-left.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>Histórico de Pesagem</Text>

        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar animal por número..."
            value={busca}
            onChangeText={setBusca}
            keyboardType="numeric"
          />
        </View>

        {animaisFiltrados.map((animal) => (
          <View key={animal.id} style={styles.animalCard}>
            <View style={styles.animalInfo}>
              <View>
                <Text style={styles.animalText}>Animal: {animal.numero}</Text>
                <Text style={styles.animalText}>Peso Atual: {animal.pesoAtual} kg</Text>
              </View>

              <TouchableOpacity onPress={() => toggleExpandir(animal.id)}>
                <Feather name="search" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {animalExpandido === animal.id && (
              <View style={styles.historicoContainer}>
                {animal.historico.length > 0 ? (
                  animal.historico.map((registro, index) => (
                    <Text key={index} style={styles.historicoItem}>
                      {registro.data.toDate().toLocaleDateString('pt-BR')} - {registro.peso} kg
                    </Text>
                  ))
                ) : (
                  <Text style={styles.historicoItem}>Sem histórico de peso.</Text>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FC',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  navIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  animalCard: {
    backgroundColor: '#00B5D6',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  animalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  animalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  historicoContainer: {
    marginTop: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
  },
  historicoItem: {
    color: '#000',
    fontSize: 14,
    marginBottom: 4,
  },
});

