import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import TopoDecorativo from '../components/TopoDecorativo';

export default function CadastroRegistroPesoScreen({ navigation }) {
  const [numero, setNumero] = useState('');
  const [peso, setPeso] = useState('');

  const handleCadastrarOuAtualizar = async () => {
    if (!numero || !peso) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const animaisRef = collection(db, 'animais');
      const q = query(animaisRef, where('numero', '==', Number(numero)));
      const snapshot = await getDocs(q);

      const hoje = new Date();
      const diaHoje = hoje.toISOString().split('T')[0]; 

      if (snapshot.empty) {
        
        await addDoc(animaisRef, {
          numero: Number(numero),
          peso: [
            {
              data: new Date(),
              peso: Number(peso),
            },
          ],
        });
        alert('Animal criado e peso registrado!');
      } else {
        
        const animalDoc = snapshot.docs[0];
        const ref = doc(db, 'animais', animalDoc.id);
        const dados = animalDoc.data();

        const pesoAtual = Array.isArray(dados.peso) ? dados.peso : [];

        const indexPesoHoje = pesoAtual.findIndex((item) => {
          const dataItem = item.data.toDate ? item.data.toDate() : new Date(item.data);
          const diaPeso = dataItem.toISOString().split('T')[0];
          return diaPeso === diaHoje;
        });

        if (indexPesoHoje !== -1) {
          
          Alert.alert(
            'Registro duplicado',
            'Peso já registrado hoje. Deseja atualizar o valor?',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'Atualizar',
                onPress: async () => {
                  pesoAtual[indexPesoHoje].peso = Number(peso);
                  pesoAtual[indexPesoHoje].data = new Date();
                  await updateDoc(ref, { peso: pesoAtual });
                  alert('Peso atualizado com sucesso!');
                },
              },
            ]
          );
        } else {
          
          const listaPesoAtualizada = [
            ...pesoAtual,
            {
              data: new Date(),
              peso: Number(peso),
            },
          ];
          await updateDoc(ref, { peso: listaPesoAtualizada });
          alert('Peso registrado com sucesso!');
        }
      }

      setNumero('');
      setPeso('');
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar peso.');
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

      <Text style={styles.subtitle}>Cadastro de Animal/Registro de Peso</Text>

      <View style={styles.inputBox}>
        <Image
          source={require('../../assets/images/number.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Número do Animal"
          keyboardType="numeric"
          value={numero}
          onChangeText={setNumero}
        />
      </View>

      <View style={styles.inputBox}>
        <Image
          source={require('../../assets/images/material-symbols-light_balance-rounded.png')}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Peso Atual"
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCadastrarOuAtualizar}>
        <Text style={styles.buttonText}>Registrar</Text>
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
