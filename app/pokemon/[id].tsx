// Dependencies
import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
// Components
// import PokemonStats from '../components/pokemon/PokemonStats';
// import PillBar from '../components/PillBar';
import PokemonCard from '../../components/pokemon/PokemonCard';
// import EvolutionChain from '../components/pokemon/EvolutionChain';
import Ionicons from '@expo/vector-icons/Ionicons';
// Utils
// import { getFavorites, addFavoritePokemon, removeFavoritePokemon } from '../utils/favorites.tsx';
import { pokemonColors } from '../../utils/typeColors';
import { useAppSelector } from '../../utils/hooks';
import { selectPokemonById } from '../../store/slices/pokemonSlice';
import { useLocalSearchParams } from 'expo-router';

type TypeProps = {
    type: {
        name: string;
    };
};

type PokemonProps = {
    name: string;
    id: number;
    types: TypeProps[];
}

type DetailsScreenProps = {
    route: {
        params: {
            pokemon: PokemonProps;
        };
    };
    navigation: any;
}

export default function Page() {
  const localParams = useLocalSearchParams();
  const pokemonId = localParams.id - 1;
  const pokemon = useAppSelector((state) => selectPokemonById(state, pokemonId))

  if (!pokemon) return <Text>Loading...</Text>

    // Stylesheet for this screen
    const styles = StyleSheet.create({
        container: {
            height: '100%',
            backgroundColor: 'white',
//             backgroundColor: pokemonColors[pokemon.type1].backgroundColor,
        },
        navContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
            marginBottom: 25,
        },
        navItem: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            borderRadius: 5,
            marginHorizontal: 5,
        },
        navItemText: {
            color: 'white',
            fontSize: 20,
        },
        selectedNavItemText: {
            fontWeight: 'bold',
        },
        tabContent: {
            marginHorizontal: 10,
        },
        pokedexEntryContainer: {
            flexDirection: 'row',
            paddingHorizontal: 10,
        },
        column: {
            flex: 1,
        },
        entryTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        entryInfo: {
            fontSize: 20,
            marginBottom: 10,
            paddingVertical: 1,
            alignSelf: 'flex-end',
        },
        favButton: {
            backgroundColor: pokemonColors[pokemon?.pokemon_v2_pokemontypes[0].pokemon_v2_type.name].backgroundColor,
            padding: 10,
            alignItems: 'center',
            marginBottom: 20,
        },
        favButtonText: {
            fontSize: 20,
        },
        abilityContainer: {
            marginLeft: 10,
        },
        abilitiesTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 15,
        },
        ability: {
            marginBottom: 10,
            paddingLeft: 15,
        },
        abilityName: {
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 5,
        },
        abilityDefinition: {
            fontSize: 18,
            lineHeight: 20,
        },
        movesContainer: {
            flex: 1,
            justifyContent: 'center',
            marginBottom: 15,
        },
        columnWrapper: {
            justifyContent: 'space-between',
        },
        individualMoveContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
        },
        moves: {
            textAlign: 'center',
            fontSize: 20,
        },
        loadMoreMoves: {
            fontSize: 26,
            color: pokemonColors[pokemon?.pokemon_v2_pokemontypes[0].pokemon_v2_type.name].color,
            textAlign: 'center',
        },
    });

  return (
    <ScrollView style={styles.container}>
      <PokemonCard
        pokemon={pokemon}
      />
    </ScrollView>
  );
};