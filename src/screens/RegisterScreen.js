import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import TopoDecorativo from '../components/TopoDecorativo';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      alert('Preencha todos os campos!');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert('Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      alert('Erro ao cadastrar: ' + error.message);
    }
  };

  const handleLogout = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TopoDecorativo />

      <Text style={styles.subtitle}>Cadastrar Usuário</Text>

      <View style={styles.inputBox}>
        <AntDesign name="mail" size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputBox}>
        <Feather name="lock" size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#666"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      <View style={styles.inputBox}>
        <AntDesign name="checkcircle" size={20} color="#666" />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="#666"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FC',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 14,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    color: '#000',
  },
  button: {
    backgroundColor: '#03527E',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#CC0000',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
