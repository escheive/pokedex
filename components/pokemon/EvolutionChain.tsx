// Dependencies
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
// Components
import { OctagonEvolutionLayout } from './OctagonEvolutionLayout';
// Utils
import { capitalizeString } from '../../utils/helpers';
// Types
import { EvolutionChainProps } from 'types';


interface EvolutionChainComponentProps {
  pokemonId: number;
  evolutionChain: EvolutionChainProps;
}


export const EvolutionChain:React.FC<EvolutionChainComponentProps> = ({ pokemonId, evolutionChain }) => {

  // Function to sort the pokemons evolutions
  const sortEvolutionChainByEvolution = (evolutionChain: EvolutionChainProps) => {
    // Deep copy the evolutionChain array to avoid mutating original data
    const copiedEvolutionChain: any = evolutionChain.map(species => ({
      ...species,
      pokemon_v2_pokemonevolutions: species.pokemon_v2_pokemonevolutions.map((evolution: any) => ({ ...evolution }))
    }));
  
    // Step 2: Sort the species based on their evolved_from_species_id
    const sortedEvolutionChain = copiedEvolutionChain.sort((
      a: { evolves_from_species_id: number | null; }, 
      b: { evolves_from_species_id: number | null; }
    ) => {
      if (a.evolves_from_species_id === null) return -1; // a is a root evolution
      if (b.evolves_from_species_id === null) return 1;  // b is a root evolution
      return a.evolves_from_species_id - b.evolves_from_species_id; // sort by evolved_from_species_id
    });
  
    return sortedEvolutionChain;
  };
  

  // Define pokemons sorted evolutions
  const sortedEvolutionChain = sortEvolutionChainByEvolution(evolutionChain);


  // Define Eevee and Eevees evolutions
  const eeveeEvolutionChainIds = [
    133,
    134,
    135,
    136,
    196,
    197,
    470,
    471,
    700
  ];

  return (
    <View style={styles.container}>
      <Text style= {{ fontSize: 24 }}>Evolution Chain</Text>

      {/* Check if a pokemon is part of eevees evolution chain */}
      {eeveeEvolutionChainIds.includes(pokemonId) ? (

        <OctagonEvolutionLayout evolutionChain={evolutionChain} />

      ) : (

        <View style={styles.evolutionsContainer}>
          {sortedEvolutionChain.map((evolution: any, index: number) => (
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
    textAlign: 'center',
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