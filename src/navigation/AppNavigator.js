import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MenuScreen from '../screens/MenuScreen';
import CadastroRegistroPesoScreen from '../screens/CadastroRegistroPesoScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import ExportarScreen from '../screens/ExportarScreen';
import ResetSenhaScreen from '../screens/ResetSenhaScreen';



const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
        />

        <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{ headerShown: false }}
        />


        <Stack.Screen
          name="CadastroRegistroPeso"
          component={CadastroRegistroPesoScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
            name="Historico"
            component={HistoricoScreen} 
            options={{ headerShown: false }}
        />

      <Stack.Screen
        name="Exportar"
        component={ExportarScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen 
      name="ResetSenha" 
      component={ResetSenhaScreen} 
      options={{ headerShown: false }} 
      />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
