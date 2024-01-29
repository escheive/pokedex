// Dependencies
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { DrawerToggleButton } from "@react-navigation/drawer";
import Drawer from "expo-router/src/layouts/Drawer";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery, gql, useReactiveVar, useMutation, useApolloClient } from '@apollo/client';
// Components
import { ListViewScreen } from 'components/ListViewScreen';
import { PokemonFilterDrawer } from 'components/pokemon/PokemonFilterDrawer';
// graphQL
import { POKEMON_LIST_QUERY } from 'api/queries';
import { handleClearApolloCache } from 'api/reset';
// Constants
import { groupedVersions, versionOptions } from 'constants/Pokemon';

import { FilterOptions } from 'types';

import mmkv from 'utils/mmkvConfig';
const INITIAL_SETUP_KEY = 'hasInitialSetup';


export default function Page() {
  const apolloClient = useApolloClient();
  // State to track various filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    showFavorites: false,
    showCaughtPokemon: false,
    selectedVersions: [],
    selectedTypes: [],
    searchQuery: '',
    filterByDualTypes: false,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { loading, error, data: pokemonList, networkStatus } = useQuery(POKEMON_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });

  // function to handle search query changes
  const handleSearchQueryChange = (query: string) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      searchQuery: query,
    }));
  };

  // function to handle the filtering of pokemon
  const filterPokemon = () => {
    const {
      showFavorites,
      showCaughtPokemon,
      selectedVersions,
      selectedTypes,
      searchQuery,
      filterByDualTypes
    } = filterOptions;


    // return pokemon list after filters have been applied
    return pokemonList?.pokemon_v2_pokemon.filter((pokemon: any) => {
      // Ensure pokemon is true before accessing any properties
      if (!pokemon) return false;

      const { name, id, isFavorited, isCaught, pokemon_v2_pokemontypes: pokemonTypes } = pokemon;

      // return false if user filters for favorites and pokemon isnt favorited
      if (showFavorites && !isFavorited) return false;

      // return false if user filters for caught and pokemon isnt caught
      if (showCaughtPokemon && !isCaught) return false;

      // return false if user searches for a pokemon by name and pokemon doesnt have that letter
      if (searchQuery !== '' && !name.startsWith(searchQuery)) return false;

      // Logic to match filtered versions with pokemon id ranges
      const isInSelectedVersions = selectedVersions.length === 0 || selectedVersions.some(version => {
        const range = groupedVersions[version];
        return id >= range.start && id <= range.end;
      });
      // return false if a pokemons id isnt in the selected versions range
      if (!isInSelectedVersions) return false;
      
      // Logic to match pokemon types and if a user wants to filter by dual types
      const matchesSelectedTypes = selectedTypes.length === 0 || (
        filterByDualTypes
          ? selectedTypes.every(type => pokemonTypes.some(pokemonType => pokemonType.pokemon_v2_type.name.includes(type)))
          : selectedTypes.some(type => pokemonTypes.some(pokemonType => pokemonType.pokemon_v2_type.name.includes(type)))
      );
      // return false if a pokemon doesnt possess the filtered types
      if (!matchesSelectedTypes) return false;

      // return true if a pokemon meets all of the previous criteria
      return true;
    });
  };

  // Call the filterItems function to filter the pokemon list
  const filteredItems = useMemo(() => filterPokemon(), [filterOptions, pokemonList]);


  const renderPokemonList = () => {
    // if (loading) {
    //   return <Text>Loading...</Text>
    // };

    return <ListViewScreen title='pokemon' filteredItems={filteredItems} loading={loading} />
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
          <PokemonFilterDrawer filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
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
        <TouchableOpacity onPress={() => handleClearApolloCache(apolloClient)}>
          <Text>Clear Apollo Cache</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => mmkv.set(INITIAL_SETUP_KEY, 'false')}>
          <Text>RESET Initial setup</Text>
        </TouchableOpacity>
      </View>
      {pokemonList ? renderPokemonList() : null}
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
});