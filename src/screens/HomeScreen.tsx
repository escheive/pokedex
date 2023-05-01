import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import GradientBackground from '../components/GradientBackground';

const HomeScreen = ({ navigation }) => {
  return (
        <View style={styles.container}>
          <Text style={styles.heading}>Welcome to My App!</Text>
          <Text style={styles.body}>This is the home screen.</Text>
          <Button
            title="Go to Details"
            onPress={() => navigation.navigate('Details')}
          />
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  body: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});

export default HomeScreen;