import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import TopoDecorativo from '../components/TopoDecorativo';

export default function ResetSenhaScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetSenha = async () => {
    if (!email) {
      Alert.alert('Erro', 'Digite o e-mail para redefinir a senha.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Sucesso', 'Um link de redefinição de senha foi enviado para seu e-mail.');
      navigation.goBack();
    } catch (error) {
      console.log(error);
      let msg = 'Erro ao enviar e-mail de redefinição.';
      if (error.code === 'auth/user-not-found') msg = 'E-mail não cadastrado.';
      Alert.alert('Erro', msg);
    }
  };

  return (
    <View style={styles.container}>
      <TopoDecorativo />
      <Text style={styles.subtitle}>Redefinir Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleResetSenha}>
        <Text style={styles.buttonText}>Enviar link</Text>
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
    padding: 24,
    paddingTop: 40,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#03527E',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
