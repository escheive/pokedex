import React, { useState, useEffect } from 'react';
import { Platform, View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Dimensions, Switch, TextInput } from 'react-native';
import { pokemonColors } from '../../../utils/typeColors';
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

import { useQuery, gql } from '@apollo/client';

const screenWidth = Dimensions.get('window').width;

// Define Graphql query
const ABILITIES_LIST_QUERY = gql`
  query fetchAllPokemonAbilities {
    pokemon_v2_ability {
      id
      name
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
  const dispatch = useAppDispatch();
  const [filterOptions, setFilterOptions] = useState({
    showFavorites: false,
    selectedTypes: [],
    searchQuery: '',
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
//   const { loading, data: pokemonList, error } = useAppSelector(selectPokemon);
  const { loading, error, data, networkStatus } = useQuery(ABILITIES_LIST_QUERY);
  console.log(loading, error, networkStatus);
  const abilitiesList = data?.pokemon_v2_ability;

  if (loading) {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      return <Text>Loading...</Text>
    } else {
      return <p>Loading...</p>
    }
  }
  if (data) {
    dispatch(setAbilities(abilitiesList))
  }

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
    const filteredList = abilitiesList && abilitiesList.filter((ability: any) =>
      (showFavorites ? ability.isFavorite : true) &&
        ability.name.toLowerCase().startsWith(searchQuery.toLowerCase()
      )
    );

    return filteredList;
  };

  const filteredAbilities = filterAbilities();

  const handleFavoritePress = () => {
    console.log('favorited')
  }

  const renderItem = ({ item: ability }: {item: any}) => {

    // const iconContainer = (
    //   <View style={{ flexDirection: 'row' }}>
    //     {item?.isFavorite ? (
    //       <Ionicons
    //         name="star"
    //         size={24} color="#555"
    //         onPress={() => handleFavoritePress(item)}
    //       />
    //     ) : (
    //       <Ionicons
    //         name="star-outline"
    //         size={24} color="#555"
    //         onPress={() => handleFavoritePress(item)}
    //       />
    //     )}
    //   </View>
    // );

    return (
      <View style={styles.itemContainer}>
        <Link 
          style={styles.itemCard} 
          href={{
            pathname: '/abilities/[id]',
            params: { id: ability.id }
          }}
        >
          <View style={styles.itemDetails}>
            <Text style={styles.itemId}>{ability?.id}</Text>
            <Text style={styles.itemName}>{capitalizeString(ability?.name)}</Text>
            <Text style={styles.shortEffect}>{ability?.pokemon_v2_ability}</Text>
            <Text style={styles.shortEffect}>EFFECT: {ability?.pokemon_v2_abilityeffecttexts[0]?.effect}</Text>
            <Text style={styles.shortEffect}>SHORT EFFECT: {ability?.pokemon_v2_abilityeffecttexts[0]?.short_effect}</Text>
            <Text style={styles.shortEffect}>FLAVOR TEXT: {ability?.pokemon_v2_abilityflavortexts[0]?.flavor_text}</Text>
          </View>
        </Link>
      </View>
    );
  };

  const renderAbilitiesList = () => {
    if (loading) {
      return (
        <Text>Loading...</Text>
      )
    };

    if (error) {
      return (
        <Text>Error: {error.message}</Text>
      )
    };

    const listContent = (filteredAbilities.length === 0) ? (
      <Text style={{ textAlign: 'center' }}>There are no results for {filterOptions.searchQuery}</Text>
    ) : (
      <FlatList
        data={filteredAbilities}
        renderItem={renderItem}
        keyExtractor={(ability) => ability.name}
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
      <View>
        {renderAbilitiesList()}
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
      width: screenWidth - 10,
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      backgroundColor: '#fff',
    },
    itemCard: {

    },
    itemDetails: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemName: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    itemId: {
      fontSize: 14,
      color: '#777',
      marginRight: 10,
    },
    shortEffect: {
      fontSize: 16,
      fontStyle: 'italic',
      color: '#333',
      flexShrink: 1,
    },
    image: {
      width: 75,
      height: 75,
    },
});