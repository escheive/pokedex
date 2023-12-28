// Dependencies
import React, { useState } from 'react';
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

export default function Page() {
  // State to track various filter options
  const [filterOptions, setFilterOptions] = useState({
    showFavorites: false,
    showCaughtPokemon: false,
    selectedVersions: [],
    selectedTypes: [],
    searchQuery: '',
    filterByDualTypes: false,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { loading, error, data: pokemonList, networkStatus } = useQuery(POKEMON_LIST_QUERY);
  console.log(loading, error, networkStatus);
  console.log(pokemonList.pokemon_v2_pokemon[0].pokemon_v2_pokemontypes)

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

    // Turn pokemonList to an object
    const filteredList = pokemonList.pokemon_v2_pokemon && pokemonList.pokemon_v2_pokemon.filter((pokemon: any) =>
      (showFavorites ? pokemon.isFavorited : true) &&
      (showCaughtPokemon ? pokemon.isCaught : true) &&
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
            pokemon.pokemon_v2_pokemontypes[0].pokemon_v2_type.name.includes(type) || (pokemon.pokemon_v2_pokemontypes[1] && pokemon.pokemon_v2_pokemontypes[1].pokemon_v2_type.name.includes(type))
          ) :
          // Filter for Pokemon with any of selected types
          selectedTypes.some((type) =>
            pokemon.pokemon_v2_pokemontypes[0].pokemon_v2_type.name.includes(type) || (pokemon.pokemon_v2_pokemontypes[1] && pokemon.pokemon_v2_pokemontypes[1].pokemon_v2_type.name.includes(type))
          )
        ) : true
      ) &&
      pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    return filteredList;
  };


  const filteredItems = filterPokemon();


  const renderPokemonList = () => {
    if (loading) {
      return <Text>Loading...</Text>
    };

    return <ListViewScreen filteredItems={filteredItems} />
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
        <TouchableOpacity onPress={handleClearApolloCache}>
          <Text>Clear Apollo Cache</Text>
        </TouchableOpacity>
      </View>
      {renderPokemonList()}
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