import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OctagonLayout = ({ evolutionChain }) => {
    const centerPokemon = evolutionChain.find(pokemon => pokemon.name === 'eevee');
    const evolutions = centerPokemon.evolutionDetails.filter(pokemon => pokemon.name !== 'eevee');
    console.log(centerPokemon.name)
    console.log(evolutions)

//     console.log(evolutionChain)

return (
    <View style={styles.container}>
      <Text>Evolution Chain</Text>
      <View style={styles.evolutionsContainer}>
        <View style={styles.centerPokemon}>
          <Text>Eevee</Text>
        </View>
        {evolutions.map((pokemon, index) => (
          <View key={index} style={styles.evolutionContainer}>
            <Text>{pokemon.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  evolutionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  centerPokemon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  evolutionContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});

export default OctagonLayout;
