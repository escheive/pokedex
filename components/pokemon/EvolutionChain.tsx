import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
// Components
import { OctagonEvolutionLayout } from './OctagonEvolutionLayout';
// Utils
import { capitalizeString } from '../../utils/helpers';

export const EvolutionChain = ({ pokemonId, evolutionChain }) => {

  const sortEvolutionChainByEvolution = (evolutionChain) => {
    // Deep copy the evolutionChain array to avoid mutating original data
    const copiedEvolutionChain = evolutionChain.map(species => ({
      ...species,
      pokemon_v2_pokemonevolutions: species.pokemon_v2_pokemonevolutions.map(evolution => ({ ...evolution }))
    }));
  
    // Step 2: Sort the species based on their evolved_from_species_id
    const sortedEvolutionChain = copiedEvolutionChain.sort((a, b) => {
      if (a.evolves_from_species_id === null) return -1; // a is a root evolution
      if (b.evolves_from_species_id === null) return 1;  // b is a root evolution
      return a.evolves_from_species_id - b.evolves_from_species_id; // sort by evolved_from_species_id
    });
  
    return sortedEvolutionChain;
  };
  
  // Usage
  const sortedEvolutionChain = sortEvolutionChainByEvolution(evolutionChain);

  // const sortEvolutionChainById = (evolutionChain) => {
  //   // Deep copy the evolutionChain array to avoid mutating original data
  //   const copiedEvolutionChain = evolutionChain.map(species => ({
  //     ...species,
  //     pokemon_v2_pokemonevolutions: species.pokemon_v2_pokemonevolutions.map(evolution => ({ ...evolution }))
  //   }));
  
  //   // Sorting the evolution chain based on the IDs
  //   const sortedEvolutionChain = copiedEvolutionChain.sort((a, b) => a.id - b.id);
  
  //   // If there are evolutions, ensure they are sorted as well
  //   sortedEvolutionChain.forEach(species => {
  //     species.pokemon_v2_pokemonevolutions.sort((a, b) => a.evolved_species_id - b.evolved_species_id);
  //   });
  
  //   return sortedEvolutionChain;
  // };
  
  // // Usage
  // const sortedEvolutionChain = sortEvolutionChainById(evolutionChain);

  console.log(evolutionChain)


  return (
    <View style={styles.container}>
      <Text style= {{ fontSize: 24 }}>Evolution Chain</Text>
    {pokemonId === 133 ? (
      <OctagonEvolutionLayout evolutionChain={evolutionChain} />
    ) : (
      <View style={styles.evolutionsContainer}>
      {sortedEvolutionChain.map((evolution, index) => (
        <React.Fragment key={index}>
          {index < sortedEvolutionChain.length && evolution.pokemon_v2_pokemonevolutions[0] && (
            <View style={styles.arrowContainer}>
              <Ionicons name='arrow-forward-sharp' size={32} color='gray' />
              <Text style={styles.evolutionTrigger}>{evolution.pokemon_v2_pokemonevolutions[0]?.pokemon_v2_evolutiontrigger.name}</Text>
            </View>
          )}
          <Link 
            style={styles.evolutionItemContainer} 
            href={`/pokemon/${evolution.id}`}
          >
            <Image
              style={styles.image}
              source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png` }}
              contentFit="contain"
              transition={500}
            />
            <Text>{capitalizeString(evolution.name)}</Text>
            <Text>{capitalizeString(evolution.id)}</Text>
          </Link>
        </React.Fragment>
      ))}
      </View>
    )}
    </View>
  )
};

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