import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Dimensions, Switch, TextInput } from 'react-native';
import { pokemonColors } from '../../../utils/typeColors';
import { capitalizeString } from '../../../utils/helpers';
// // import { fetchPokemonData } from '../utils/api';
// import { fetchPokemonData } from '../store/slices/pokemonSlice';
// import { fetchPokemonDetails } from '../services/pokemonService';
import Ionicons from '@expo/vector-icons/Ionicons';
// import { updatePokemonStatusAction, updatePokemonFavoriteStatusAction } from '../actions/pokemonActions';
// import FilterDropdownDrawer from '../components/FilterDropdownDrawer';
import { setPokemon, selectPokemon } from '../../../store/slices/pokemonSlice';
// import { selectAbilities } from '../store/slices/abilitiesSlice';
import { useAppSelector, useAppDispatch } from '../../../utils/hooks';
// import { setPokemonFavoriteStatus, setPokemonCaughtStatus } from '../store/slices/pokemonSlice';
import { Link } from 'expo-router';
import { Image } from "expo-image";
import { DrawerToggleButton } from "@react-navigation/drawer";
import Drawer from "expo-router/src/layouts/Drawer";

import { useQuery, gql } from '@apollo/client';

// Define Graphql query
const POKEMON_LIST_QUERY = gql`
  query pokemonListQuery {
    pokemon_v2_pokemon {
      id
      name
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          id
        }
      }
    }
  }
`;

const versionOptions = [
    { key: 'gen1', label: 'Gen 1' },
    { key: 'gen2', label: 'Gen 2' },
    { key: 'gen3', label: 'Gen 3' },
    { key: 'gen4', label: 'Gen 4' },
    { key: 'gen5', label: 'Gen 5' },
    { key: 'gen6', label: 'Gen 6' },
    { key: 'gen7', label: 'Gen 7' },
    { key: 'gen8', label: 'Gen 8' },
    { key: 'gen9', label: 'Gen 9' },
];

export default function Page() {
  const dispatch = useAppDispatch();
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
//     const [showFavorites, setShowFavorites] = useState(false);
//     const [showCaughtPokemon, setShowCaughtPokemon] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    showFavorites: false,
    showCapturedPokemon: false,
    selectedVersions: [],
    selectedTypes: [],
    searchQuery: '',
    filterByDualTypes: false,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
//   const { loading, data: pokemonList, error } = useAppSelector(selectPokemon);
  const { loading, error, data, networkStatus } = useQuery(POKEMON_LIST_QUERY);
  const pokemonList = data?.pokemon_v2_pokemon;

  if (loading) return <Text>Loading...</Text>
  if (data) {
    dispatch(setPokemon(pokemonList))
  }

  // function to handle search query changes
  const handleSearchQueryChange = (query: string) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      searchQuery: query,
    }));
  };

  const groupedVersions = {
    gen1: { start: 1, end: 151 },
    gen2: { start: 152, end: 251 },
    gen3: { start: 252, end: 386 },
    gen4: { start: 387, end: 493 },
    gen5: { start: 494, end: 649 },
    gen6: { start: 650, end: 721 },
    gen7: { start: 722, end: 809 },
    gen8: { start: 810, end: 905 },
    gen9: { start: 906, end: 1010 },
  };

  // function to handle the filtering of pokemon
  const filterPokemon = () => {
    const {
      showFavorites,
      showCapturedPokemon,
      selectedVersions,
      selectedTypes,
      searchQuery,
      filterByDualTypes
    } = filterOptions;

    // Turn pokemonList to an object
    const filteredList = pokemonList && pokemonList.filter((pokemon: any) =>
      (showFavorites ? pokemon.isFavorite : true) &&
      (showCapturedPokemon ? pokemon.isCaptured : true) &&
      (selectedVersions.length > 0 ?
        selectedVersions.some((version) => {
          const range = groupedVersions[version];
          return pokemon.id >= range.start && pokemon.id <= range.end;
      }) : true
    ) &&
    (selectedTypes.length > 0 ?
      (filterByDualTypes ?
        // Filter for Pokemon with both selected types
        selectedTypes.every((type) =>
          pokemon.type1.includes(type) || (pokemon.type2 && pokemon.type2.includes(type))
        ) :
        // Filter for Pokemon with any of selected types
        selectedTypes.some((type) =>
          pokemon.type1.includes(type) || (pokemon.type2 && pokemon.type2.includes(type))
        )
      ) : true
    ) &&
      pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    return filteredList;
  };

  const filteredPokemon = filterPokemon();

  const handleFavoritePress = () => {
    console.log('favorited')
  }

  const handleCaughtPress = () => {
    console.log('caught')
  }

  const renderItem = ({ item: pokemon }: { item: any }) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = screenWidth - 5;
    const type1 = pokemon.pokemon_v2_pokemontypes[0].pokemon_v2_type.name;
    const type2 = pokemon.pokemon_v2_pokemontypes[1]?.pokemon_v2_type.name;

    const backgroundColor = pokemonColors[type1].backgroundColor;
    const textColor = pokemonColors[type1].color;

    const iconContainer = (
      <View style={{ flexDirection: 'row' }}>
        {pokemon.isFavorite ? (
          <Ionicons
            name="star"
            size={24} color="#555"
            onPress={() => handleFavoritePress(pokemon)}
          />
        ) : (
          <Ionicons
            name="star-outline"
            size={24} color="#555"
            onPress={() => handleFavoritePress(pokemon)}
          />
        )}
        {pokemon.isCaught ? (
          <Ionicons
            name="checkmark-circle-outline"
            size={26} color="#555"
            onPress={() => handleCaughtPress(pokemon)}
          />
        ) : (
          <Ionicons
            name="ellipse-outline"
            size={26} color="#555"
            onPress={() => handleCaughtPress(pokemon)}
          />
        )}
      </View>
    );

    const typesContainer = (
      <View style={styles.pokemonTypesContainer}>
        <Text style={[styles.pokemonType, { color: textColor }]}>{capitalizeString(type1)}</Text>
        {type2 && <Text style={[styles.pokemonType, { color: textColor }]}>{capitalizeString(type2)}</Text>}
      </View>
    );

    return (
      <View style={[styles.itemContainer, { width: itemWidth, backgroundColor }]}>
        <Link 
          style={styles.itemCard} 
          href={{
            pathname: '/pokemon/[id]',
            params: { id: pokemon.id }
          }}
        >
          <View style={styles.itemDetailsContainer}>
            <Text style={[styles.pokemonId, { color: textColor }]}>{pokemon.id}</Text>
            <View style={styles.pokemonNameAndTypeContainer}>
              <View style={styles.nameContainer}>
                <Text style={[styles.pokemonName, { color: textColor } ]}>{capitalizeString(pokemon.name)}</Text>
                {iconContainer}
              </View>
              {typesContainer}
            </View>
          </View>
          <Image
            style={styles.image}
            source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
            contentFit="contain"
            transition={1000}
          />
        </Link>
      </View>
    );
  };

  const renderPokemonList = () => {
    if (loading) {
      return (
        <Text>Loading...</Text>
      )
    };

    if (error) {
      return (
        <Text>Error: {error}</Text>
      )
    };

    const listContent = (filteredPokemon.length === 0) ? (
      <Text style={{ textAlign: 'center' }}>There are no results for {filterOptions.searchQuery}</Text>
    ) : (
      <FlatList
        data={filteredPokemon}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
        windowSize={10}
      />
    );

    return listContent;
  };

  return (
    <View style={styles.container}>
      <Drawer.Screen
        options={{
          title: "Pokemon",
          headerShown: true,
          headerLeft: () => <DrawerToggleButton />
        }}
      />
      <View style={styles.filterContainer}>
        <View style={styles.filtersContainer}>
          {/* <FilterDropdownDrawer setSelectedVersions={setSelectedVersions} filterOptions={filterOptions} setFilterOptions={setFilterOptions} /> */}
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={18} color="black"
            />
            <TextInput
              style={styles.searchInput}
              value={filterOptions.searchQuery}
              onChangeText={handleSearchQueryChange}
              placeholder="Search Pokemon"
            />
          </View>
        </View>
      </View>
      <View>
        {renderPokemonList()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    filterContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginVertical: 10,
      zIndex: 2
    },
    filterTitleText: {
      fontSize: 18,
    },
    dropdownContainer: {
      position: 'relative',
    },
    dropdownTrigger: {
      padding: 10,
      backgroundColor: '#F5F5F5',
      borderColor: '#DDDDDD',
      borderWidth: 1,
      borderRadius: 5,
    },
    dropdownContent: {
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderColor: '#DDDDDD',
      borderWidth: 1,
      borderRadius: 5,
      marginTop: 5,
      padding: 10,
    },
    filtersContainer: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    searchInputContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    searchInput: {
      fontSize: 16,
    },
    listContainer: {
      alignItems: 'center',
      zIndex: 1,
    },
    itemContainer: {
      marginVertical: 10,
      aspectRatio: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    itemCard: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    itemDetailsContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      flex: 1,
    },
    pokemonId: {
      fontSize: 16,
    },
    nameContainer: {
      flexDirection: 'row',
    },
    pokemonName: {
      fontSize: 20,
      marginBottom: 10,
      paddingRight: 15,
    },
    pokemonTypesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    pokemonType: {
      fontSize: 16,
      fontWeight: 'bold',
      paddingHorizontal: 20,
      marginRight: 15,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#555',
      textAlign: 'center',
    },
    image: {
      width: 75,
      height: 75,
    },
});