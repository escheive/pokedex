import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Image, Dimensions, Switch, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pokemon } from '../types';
import { getTypeStyle, pokemonColors } from '../utils/typeStyle';
import { capitalizeString } from '../utils/helpers';
// import { fetchPokemonData } from '../utils/api';
import { fetchPokemonData } from '../store/slices/pokemonSlice';
import { fetchPokemonDetails } from '../services/pokemonService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { updatePokemonStatusAction, updatePokemonFavoriteStatusAction } from '../actions/pokemonActions';
import FilterDropdownDrawer from '../components/FilterDropdownDrawer';
import { selectPokemon } from '../store/slices/pokemonSlice';
import { selectAbilities } from '../store/slices/abilitiesSlice';
import { useAppSelector, useAppDispatch } from '../hooks';
import { resetPokemonTable } from '../utils/database/pokemonDatabase';

type Props = {
    navigation: StackNavigationProp<any>;
    pokemonList: Pokemon[];
    typeData: { [key: string]: typeData };
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



const PokemonScreen = ({ navigation, typeData, route }: Props) => {
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
  const { loading, data: pokemonList, error } = useAppSelector(selectPokemon);

  useEffect(() => {
//     resetPokemonTable()
//       .then(() => dispatch(fetchPokemonData()))
//       .catch((error) => console.error('Error fetching pokemon data:', error));
    dispatch(fetchPokemonData())

  }, [dispatch]);

    // function to handle user press on a pokemon
    const handlePress = async (pokemon: Pokemon) => {
      // Fetch full details using an asynchronous function
      const fullPokemonDetails = await fetchPokemonDetails(pokemon.id);
      // Navigate to details page with full Pokemon details
      navigation.navigate('Details', { pokemon: fullPokemonDetails });
    };

    // function to handle search query changes
    const handleSearchQueryChange = (query) => {
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

//     const handleVersionSelect = (version: string) => {
//       let updatedVersions: string[] = [];
//
//       if (groupedVersions.hasOwnProperty(version)) {
//         // If the selected version is a grouped version, handle it accordingly
//         const range = groupedVersions[version];
//         if (selectedVersions.includes(version)) {
//           updatedVersions = selectedVersions.filter((v) => v !== version);
//         } else {
//           updatedVersions = [...selectedVersions, version];
//         }
//       } else {
//         // If the selected version is not a grouped version, handle it as usual
//         if (selectedVersions.includes(version)) {
//           updatedVersions = selectedVersions.filter((v) => v !== version);
//         } else {
//           updatedVersions = [...selectedVersions, version];
//         }
//       }
//
//       setSelectedVersions(updatedVersions);
//     };


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
        const filteredList = pokemonList && pokemonList.filter((pokemon) =>
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


    const handleFavoritePress = (selectedPokemon) => {
        // Update the isFavorite value in the database
        const updatedFavoriteValue = !selectedPokemon.isFavorite;
        // pokemon action to update the pokemon in the pokemonList state
        dispatch(updatePokemonStatusAction(selectedPokemon.id, 'isFavorite', updatedFavoriteValue));
//         // pokemon action to update the pokemon in the pokemonList state
//         dispatch(updatePokemonFavoriteStatusAction(selectedPokemon.id, updatedFavoriteValue));
    }

    const handleCapturePress = (selectedPokemon) => {
        // Update the isCaptured value in the database
        const updatedCaptureValue = !selectedPokemon.isCaptured;
        // pokemon action to update the pokemon in the pokemonList state
        dispatch(updatePokemonStatusAction(selectedPokemon.id, 'isCaptured', updatedCaptureValue));
//         // pokemon action to update the pokemon in the pokemonList state
//         dispatch(updatePokemon(selectedPokemon.id, updatedCaptureValue));
    }


    const renderItem = ({ item: pokemon }: { item: Pokemon }) => {
        const screenWidth = Dimensions.get('window').width;
        // Width for one column
        const itemWidth = screenWidth - 5;
        const backgroundColor = pokemon.type1 ? pokemonColors[pokemon.type1].backgroundColor : '';
        return (
            <View style={[styles.itemContainer, { width: itemWidth, backgroundColor }]}>
                <TouchableOpacity style={styles.itemCard} onPress={() => handlePress(pokemon)}>
                    <View style={styles.itemDetailsContainer}>
                        <Text style={[styles.pokemonId, { color: pokemon.type1 ? pokemonColors[pokemon.type1].color : 'white' }]}>{pokemon.id}</Text>

                        <View style={styles.pokemonNameAndTypeContainer}>
                            <View style={styles.nameContainer}>
                                <Text style={[styles.pokemonName, { color: pokemonColors[pokemon.type1].color } ]}>{capitalizeString(pokemon.name)}</Text>
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
                                    {pokemon.isCaptured ? (
                                        <Ionicons
                                            name="checkmark-circle-outline"
                                            size={26} color="#555"
                                            onPress={() => handleCapturePress(pokemon)}
                                        />
                                    ) : (
                                        <Ionicons
                                            name="ellipse-outline"
                                            size={26} color="#555"
                                            onPress={() => handleCapturePress(pokemon)}
                                        />
                                    )}
                                </View>
                            </View>

                            <View style={styles.pokemonTypesContainer}>
                                <Text style={styles.pokemonType}>{capitalizeString(pokemon.type1)}</Text>
                                {pokemon.type2 && (
                                    <Text style={styles.pokemonType}>{capitalizeString(pokemon.type2)}</Text>
                                )}
                            </View>
                        </View>


                    </View>
                    <Image
                        style={styles.image}
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
                    />
                </TouchableOpacity>
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
      />
    );

    return listContent;

//     if (filteredPokemon.length === 0) {
//       return <Text style={{ textAlign: 'center' }}>There are no results for {filterOptions.searchQuery}</Text>
//     }
//
//     return (
//       <FlatList
//         data={filteredPokemon}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.name}
//         contentContainerStyle={styles.listContainer}
//       />
//     );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.filtersContainer}>
          <FilterDropdownDrawer setSelectedVersions={setSelectedVersions} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
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
        // aspectRatio for two columns
//         aspectRatio: 1,
        aspectRatio: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    itemCard: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    itemDetailsContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    pokemonId: {
        fontSize: 16,
        paddingRight: 40,
    },
    nameContainer: {
        flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginRight: 15,
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
        borderColor: '#555',
        borderRadius: 10,
        textAlign: 'center',
    },
    image: {
//         width: 100,
//         height: 100,
        width: 75,
        height: 75,
    },
});

export default PokemonScreen;