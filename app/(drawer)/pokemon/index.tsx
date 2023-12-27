// Dependencies
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { DrawerToggleButton } from "@react-navigation/drawer";
import Drawer from "expo-router/src/layouts/Drawer";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery, gql, useReactiveVar, useMutation, useApolloClient } from '@apollo/client';
// Components
import { ListViewScreen } from 'components/ListViewScreen';

// Define Graphql query
const POKEMON_LIST_QUERY = gql`
  query pokemonListQuery {
    pokemon_v2_pokemon {
      id
      name
      isFavorited @client
      isCaught @ client
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          id
        }
      }
    }
  }
`;

type GroupedVersions = {
  [version: string]: {
    start: number;
    end: number
  };
};

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
  // const dispatch = useAppDispatch();
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCaughtPokemon, setShowCaughtPokemon] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    showFavorites: false,
    showCaughtPokemon: false,
    selectedVersions: [],
    selectedTypes: [],
    searchQuery: '',
    filterByDualTypes: false,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  // const favoritedPokemon = useReactiveVar(favoritedPokemonVar);
  const { loading, error, data: pokemonList, networkStatus } = useQuery(POKEMON_LIST_QUERY);
  console.log(loading, error, networkStatus);

  const apolloClient = useApolloClient();

  const handleClearApolloCache = () => {
    apolloClient.resetStore().catch((error) => {
      console.error("Error clearing cache", error);
    });
  };

  // Function that allows users to mark a pokemon as favorited/caught
  const handleToggleFavoriteAndCaught = (pokemon, statusToUpdate) => {
    console.log(pokemon.name, statusToUpdate)

    // Update the pokemon's status to opposite of what is was set to when clicked
    pokemon[statusToUpdate] = !pokemon[statusToUpdate];

    // Edit the pokemon list by accessing it in cache by id
    // Using fragment allows editing of a 'fragment' of the cache instead of the whole query list
    apolloClient.writeFragment({
      id: `pokemon_v2_pokemon:${pokemon.id}`,
      fragment: gql`
        fragment UpdatedPokemon on pokemon_v2_pokemon {
          ${statusToUpdate}
        }
      `,
      data: {
        __typename: 'pokemon_v2_pokemon',
        [statusToUpdate]: !pokemon[statusToUpdate]
      },
    })
  };


  // function to handle search query changes
  const handleSearchQueryChange = (query: string) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      searchQuery: query,
    }));
  };

  const groupedVersions: GroupedVersions = {
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
    listContainer: {
      alignItems: 'center',
      zIndex: 1,
      width: Dimensions.get("screen").width,
      flex: 1,
      padding: "1.5%",
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
    pokemonNameAndTypeContainer: {

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