// Dependencies
import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
// Components
import { PokemonStats } from 'components/pokemon/PokemonStats';
// import EvolutionChain from '../components/pokemon/EvolutionChain';
import Ionicons from '@expo/vector-icons/Ionicons';
// Utils
// import { getFavorites, addFavoritePokemon, removeFavoritePokemon } from '../utils/favorites.tsx';
import { pokemonColors } from '../../../utils/helpers';
import { useAppSelector } from '../../../utils/hooks';
import { selectPokemonById } from '../../../store/slices/pokemonSlice';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useApolloClient, useQuery } from '@apollo/client';
import { GET_POKEMON_BY_ID } from 'api/queries';
import { pokemonFragment, pokemonDetailsFragment } from 'api/fragments';
import { Pokemon } from 'types';
import { PokemonCard } from 'components/pokemon/PokemonCard';
import { EvolutionChain } from 'components/pokemon/EvolutionChain';


export default function Page() {
  const client = useApolloClient();
  const params = useLocalSearchParams();
  const pokemonId = params.id;

  const { loading, error, data: pokemon } = useQuery(GET_POKEMON_BY_ID, {
    variables: { id: pokemonId },
  });

  if (loading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    console.log('Error', error)
  }

  if (!pokemon) {
    return <Text>Loading...</Text>
  }

  return (
    <ScrollView style={styles.container}>
      <PokemonCard pokemon={pokemon.pokemon_v2_pokemon_by_pk} />

      <PokemonStats pokemonTypes={pokemon.pokemon_v2_pokemon_by_pk.pokemon_v2_pokemontypes} pokemonStats={pokemon.pokemon_v2_pokemon_by_pk.pokemon_v2_pokemonstats} />

      <EvolutionChain pokemonId={pokemon.pokemon_v2_pokemon_by_pk.id} evolutionChain={pokemon.pokemon_v2_pokemon_by_pk.pokemon_v2_pokemonspecy.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies} />

    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
  },
});