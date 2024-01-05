import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
// Components
// import OctagonLayout from './OctagonLayout';
// Utils
import { capitalizeString } from '../../utils/helpers';

export const EvolutionChain = ({ pokemonId, evolutionChain }) => {

  const sortEvolutionChainById = (evolutionChain) => {
    // Deep copy the evolutionChain array to avoid mutating original data
    const copiedEvolutionChain = evolutionChain.map(species => ({
      ...species,
      pokemon_v2_pokemonevolutions: species.pokemon_v2_pokemonevolutions.map(evolution => ({ ...evolution }))
    }));
  
    // Sorting the evolution chain based on the IDs
    const sortedEvolutionChain = copiedEvolutionChain.sort((a, b) => a.id - b.id);
  
    // If there are evolutions, ensure they are sorted as well
    sortedEvolutionChain.forEach(species => {
      species.pokemon_v2_pokemonevolutions.sort((a, b) => a.evolved_species_id - b.evolved_species_id);
    });
  
    return sortedEvolutionChain;
  };
  
  // Usage
  const sortedEvolutionChain = sortEvolutionChainById(evolutionChain);

  console.log(evolutionChain)

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      width: '96%',
      marginHorizontal: '2%',
      borderRadius: 15,
      marginBottom: 30,
      padding: 10,
      backgroundColor: 'rgba(170, 170, 170, 0.2)',
    },
    evolutionsContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 20,
    },
    evolutionItemContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      width: '20%',
    },
    arrowContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20%',
    },
    evolutionTrigger: {
      flexWrap: 'wrap',
      maxWidth: 100,
    },
    image: {
      width: 85,
      height: 85,
    }
  })

  return (
    <View style={styles.container}>
      <Text style= {{ fontSize: 24 }}>Evolution Chain</Text>
    {pokemonId === "eevee" ? (
      <Text></Text>
      // <OctagonLayout evolutionChain={evolutionChain} />
    ) : (
      <View style={styles.evolutionsContainer}>
      {sortedEvolutionChain.map((evolution, index) => (
        <React.Fragment key={index}>
          {index < sortedEvolutionChain.length && evolution.pokemon_v2_pokemonevolutions[0] && (
            <View style={styles.arrowContainer}>
              <Ionicons name='arrow-forward-sharp' size={32} color='gray' />
              <Text style={styles.evolutionTrigger}>{evolution.pokemon_v2_pokemonevolutions[0].pokemon_v2_evolutiontrigger.name}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.evolutionItemContainer}
            onPress={() => console.log("navigate to ", evolution.name, "!")}
            activeOpacity={0.5}
          >
            <Image
              style={styles.image}
              source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png` }}
              contentFit="contain"
              transition={500}
            />
            <Text>{capitalizeString(evolution.name)}</Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}
      </View>
    )}
    </View>
  )
};