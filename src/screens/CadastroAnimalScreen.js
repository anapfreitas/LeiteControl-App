import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import TopoDecorativo from '../components/TopoDecorativo';

export default function CadastroAnimalScreen({ navigation }) {
  const [numero, setNumero] = useState('');
  const [peso, setPeso] = useState('');

  const handleCadastrar = async () => {
    if (!numero || !peso) {
      alert('Preencha todos os campos!');
      return;
    }

    const numeroConvertido = Number(numero);

    try {
      // Verifica se já existe um animal com o mesmo número
      const animaisRef = collection(db, 'animais');
      const q = query(animaisRef, where('numero', '==', numeroConvertido)); //busca apenas onde o campo numero é exatamente igual ao valor digitado
      const snapshot = await getDocs(q); //executa a consulta e retorna um snapshot "foto" dos dados encontrados

      if (!snapshot.empty) {
        alert('Este número de animal já está cadastrado!');
        return;
      }

      await addDoc(animaisRef, {
        numero: numeroConvertido,
        peso: [
          {
            data: new Date(),
            peso: Number(peso)
          }
        ],
      });

      alert('Animal cadastrado com sucesso!');
      setNumero('');
      setPeso('');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar o animal.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopoDecorativo />

      <View style={styles.rowBetween}>
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <Image
            source={require('../../assets/images/arrow-left.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Cadastrar Animal</Text>

      <View style={styles.inputBox}>
        <Image
          source={require('../../assets/images/number.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Número do Animal"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputBox}>
        <Image
          source={require('../../assets/images/animal-cow-outline.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Peso"
          value={peso}
          onChangeText={setPeso}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
        <Text style={styles.buttonText}>Cadastrar</Text>
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
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
    alignSelf: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 20,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 12,
    color: '#000',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#03527E',
    borderRadius: 24,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
