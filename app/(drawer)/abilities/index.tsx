import React, { useState, useEffect } from 'react';
import { Platform, View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Switch, TextInput, SafeAreaView } from 'react-native';
import { capitalizeString } from '../../../utils/helpers';
// // import { fetchPokemonData } from '../utils/api';
// import { fetchPokemonData } from '../store/slices/pokemonSlice';
// import { fetchPokemonDetails } from '../services/pokemonService';
import Ionicons from '@expo/vector-icons/Ionicons';
// import { updatePokemonStatusAction, updatePokemonFavoriteStatusAction } from '../actions/pokemonActions';
// import FilterDropdownDrawer from '../components/FilterDropdownDrawer';
import { setAbilities, selectAbilities } from '../../../store/slices/abilitiesSlice';
// import { selectAbilities } from '../store/slices/abilitiesSlice';
import { useAppSelector, useAppDispatch } from '../../../utils/hooks';
// import { setPokemonFavoriteStatus, setPokemonCaughtStatus } from '../store/slices/pokemonSlice';
import { Link } from 'expo-router';
import { Image } from "expo-image";
import { DrawerToggleButton } from "@react-navigation/drawer";
import Drawer from "expo-router/src/layouts/Drawer";
import { ListViewScreen } from 'components/ListViewScreen';

import { useQuery, gql } from '@apollo/client';

const screenWidth = Dimensions.get('window').width;

// Define Graphql query
const ABILITIES_LIST_QUERY = gql`
  query fetchAllPokemonAbilities {
    pokemon_v2_ability {
      id
      name
      isFavorited @client
      pokemon_v2_abilityeffecttexts(where: {language_id: {_eq: 9}}) {
        effect
        short_effect
      }
      pokemon_v2_abilityflavortexts(order_by: {id: desc}, limit: 1, where: {language_id: {_eq: 9}}) {
        flavor_text
      }
      pokemon_v2_pokemonabilities {
        pokemon_id
      }
    }
  }
`;

export default function Page() {
  // const dispatch = useAppDispatch();
  const [filterOptions, setFilterOptions] = useState({
    showFavorites: false,
    selectedTypes: [],
    searchQuery: '',
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
//   const { loading, data: pokemonList, error } = useAppSelector(selectPokemon);
  const { loading, error, data: abilitiesList, networkStatus } = useQuery(ABILITIES_LIST_QUERY, {
    fetchPolicy: 'cache-first',
  });



  // function to handle search query changes
  const handleSearchQueryChange = (query: string) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      searchQuery: query,
    }));
  };

  // function to handle the filtering of abilities
  const filterAbilities = () => {
    const {
      showFavorites,
      searchQuery,
    } = filterOptions;

    // Turn abilitiesList to an object
    const filteredList = abilitiesList.pokemon_v2_ability && abilitiesList.pokemon_v2_ability.filter((ability: any) =>
      (showFavorites ? ability.isFavorite : true) &&
        ability.name.toLowerCase().startsWith(searchQuery.toLowerCase()
      )
    );

    return filteredList;
  };

  const filteredAbilities = filterAbilities();


  const renderItemsList = () => {
    if (loading) {
      return <Text>Loading...</Text>
    };

    return <ListViewScreen query={''} title='ability' filteredItems={filteredAbilities} />
  };


  return (
    <View style={styles.container}>
      <Drawer.Screen
        options={{
          title: "Abilities",
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
              placeholder="Search Items"
            />
          </View>
        </View>
      </View>
      {abilitiesList ? renderItemsList() : (
        Platform.OS === "web" ? (
          <p>Loading....</p>
        ) : (
          <Text>Loading...</Text>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
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