// Dependencies
import { gql, useApolloClient } from '@apollo/client';
import { View, Text, ActivityIndicator, StyleSheet, Image, ImageBackground } from 'react-native';

export const LoadingScreen = ({ loadingText }: string ) => {

  return (

    <View style={styles.container}>
      <Image
        source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
        style={styles.logo}
      />

      <Text style={styles.loadingText}>{loadingText}</Text>
      <ActivityIndicator size="large" color="#FFCB05" />
      <Text style={styles.quoteText}>"Gotta catch 'em all!"</Text>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0)',
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
    color: 'black',
  },
  quoteText: {
    fontSize: 20,
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
    color: 'black',
  },
});