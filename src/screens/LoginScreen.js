import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import TopoDecorativo from '../components/TopoDecorativo';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      alert('Digite e-mail e senha!');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert('Login realizado com sucesso!');
      navigation.navigate('Menu');
    } catch (error) {
      console.log(error);
      let msg = 'Erro ao fazer login.';
      if (error.code === 'auth/user-not-found') msg = 'Usuário não encontrado.';
      if (error.code === 'auth/wrong-password') msg = 'Senha incorreta.';
      alert(msg);
    }
  };

  return (
    <View style={styles.container}>
      <TopoDecorativo />

      <Text style={styles.subtitle}>Entrar</Text>

      <View style={styles.inputBox}>
        <AntDesign name="mail" size={20} color="#666666" />
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#666666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputBox}>
        <Feather name="lock" size={20} color="#666666" />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#666666"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('ResetSenha')}
      >
        <Text style={styles.forgotText}>Esqueceu a senha?</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Acessar</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Ainda não possui uma conta?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Cadastre-se
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FC',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 24,
    paddingTop: 40,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    marginTop: 10,
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: '#7396A9',
  },
  button: {
    backgroundColor: '#03527E',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 24, 
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    fontSize: 14,
    color: '#000',
  },
  link: {
    color: '#201F1F',
    fontWeight: 'bold',
  },
});
