// Dependencies
import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
// Components
// import PokemonStats from '../components/pokemon/PokemonStats';
// import PillBar from '../components/PillBar';
import PokemonCard from '../../../components/pokemon/PokemonCard';
// import EvolutionChain from '../components/pokemon/EvolutionChain';
import Ionicons from '@expo/vector-icons/Ionicons';
// Utils
// import { getFavorites, addFavoritePokemon, removeFavoritePokemon } from '../utils/favorites.tsx';
import { pokemonColors } from '../../../utils/helpers';
import { useAppSelector } from '../../../utils/hooks';
import { selectPokemonById } from '../../../store/slices/pokemonSlice';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useApolloClient } from '@apollo/client';
import { GET_POKEMON_BY_ID } from 'api/queries';
import { pokemonFragment } from 'api/fragments';
import { Pokemon } from 'types';


export default function Page() {
  const client = useApolloClient();
  const params = useLocalSearchParams();
  const pokemonId = params.id;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    const getPokemonById = () => {
      try {
        const pokemon = client.readFragment({
          id: `pokemon_v2_pokemon:${pokemonId}`,
          fragment: pokemonFragment,
        });
  
        console.log(pokemon)
  
        setPokemon(pokemon);
      } catch (error) {
        console.error('Error reading from cache:', error);
        return null;
      }
    };

    getPokemonById();
  }, [client, pokemonId]);

  if (!pokemon) {
    return <Text>Loading...</Text>
  }

  return (
    <View>
      <Text>{pokemon.id}</Text>
      <Text>{pokemon.name}</Text>
      {pokemon.isFavorited ? <Text>Pokemon is favorited!</Text> : null}
      {pokemon.isCaught ? <Text>Pokemon has been caught!</Text> : null}
      <Text>{pokemon.pokemon_v2_pokemontypes[0].pokemon_v2_type.name}</Text>
      {pokemon.pokemon_v2_pokemontypes[1] ? (
        <Text>{pokemon.pokemon_v2_pokemontypes[1].pokemon_v2_type.name}</Text>
      ) : null}
    </View>
  )

  // return (
  //   <ScrollView style={styles.container}>
  //     <Stack.Screen options={{ headerShown: true, title: pokemon.name }} />
  //     <PokemonCard
  //       pokemon={pokemon}
  //     />
  //   </ScrollView>
  // );

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: 'white',
    },
  });
};