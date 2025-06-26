import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import TopoDecorativo from '../components/TopoDecorativo';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

export default function MenuScreen({ navigation }) {
  const [totalAnimais, setTotalAnimais] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const contarAnimais = async () => {
        try {
          const snapshot = await getDocs(collection(db, 'animais'));
          setTotalAnimais(snapshot.size);
        } catch (error) {
          console.log('Erro ao contar animais:', error);
        }
      };

      contarAnimais();
    }, [])
  );

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopoDecorativo />

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('CadastroRegistroPeso')}
      >
        <Image
          source={require('../../assets/images/ph_cow.png')}
          style={styles.icon}
        />
        <Text style={styles.menuText}>Cadastro de Animal/Registro de Peso</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.menuButton, styles.buttonHalf]}
          onPress={() => navigation.navigate('Exportar')}
        >
        <Feather name="download" size={20} color="#000000" />
        <Text style={styles.menuText}>Exportar Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, styles.buttonHalf]}
          onPress={() => navigation.navigate('Historico')}
        >
          <Image
            source={require('../../assets/images/clock.png')}
            style={styles.icon}
          />
          <Text style={styles.menuText}>Histórico</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardNumber}>{totalAnimais}</Text>
        <Text style={styles.cardText}>Total de Animais Cadastrados</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Image
          source={require('../../assets/images/log-out.png')}
          style={styles.icon}
        />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F8FC',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  menuButton: {
    backgroundColor: '#00B5D6',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  buttonHalf: {
    flex: 1,
  },
  card: {
    backgroundColor: '#03527E',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  cardNumber: {
    fontSize: 24,
    color: '#00B5D6',
    fontWeight: 'bold',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 6,
  },
  logoutButton: {
    backgroundColor: '#E33629',
    borderRadius: 24,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
