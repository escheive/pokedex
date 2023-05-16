import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, ImageBackground } from 'react-native';

const LoadingScreen = () => {
    return (
        <ImageBackground
            source={require('../assets/loading_screen_bg.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Image
                    source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
                    style={styles.logo}
                />
                <Text style={styles.loadingText}>Loading...</Text>
                <ActivityIndicator size="large" color="#FFCB05" />
                <Text style={styles.quoteText}>
                    "Gotta catch 'em all!"
                </Text>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
  quoteText: {
    fontSize: 20,
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
    color: 'white',
  },
});

export default LoadingScreen;
