import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function TopoDecorativo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/topo-curvo.png')}
        style={styles.topImage}
      />
      <View style={styles.content}>
        <Text style={styles.title}>LeiteControl</Text>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width, 
    height: 250,
    position: 'relative',
    marginBottom: 40,
    overflow: 'hidden',
  },
  topImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: width + 1, 
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    marginTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  logo: {
    width: 308,
    height: 170,
    resizeMode: 'contain',
  },
});
