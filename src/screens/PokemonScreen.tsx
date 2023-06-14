import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Image, Dimensions, Switch, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pokemon } from '../types';
import { getTypeStyle, pokemonColors } from '../utils/typeStyle';
import { capitalizeString } from '../utils/helpers';
import { fetchPokemonData } from '../utils/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { updatePokemonStatusAction, updatePokemonFavoriteStatusAction } from '../actions/pokemonActions';
import FilterDropdownDrawer from '../components/FilterDropdownDrawer';

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
    const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [showCaughtPokemon, setShowCaughtPokemon] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dispatch = useDispatch();
    const pokemonList = useSelector((state) => state.pokemon.pokemonList);

//     console.log(pokemonList)

//     const fetchPokemonDetails = async (pokemonId) => {
//       try {
//         const pokemonDetailsQuery = `SELECT * FROM Pokemon WHERE id = ?;`;
//         const pokemonDetails = await new Promise((resolve, reject) => {
//           database.transaction((tx) => {
//             tx.executeSql(
//               pokemonDetailsQuery,
//               [pokemonId],
//               (tx, result) => {
//                 if (result.rows.length > 0) {
//                   const pokemon = result.rows.item(0);
//                   resolve(pokemon);
//                 } else {
//                   resolve(null); // No Pokémon found with the provided ID
//                 }
//               },
//               (error) => {
//                 console.error('Error fetching Pokémon details:', error);
//                 reject(error);
//               }
//             );
//           });
//         });
//         return pokemonDetails;
//       } catch (error) {
//         console.error('Error fetching Pokémon details:', error);
//         throw error;
//       }
//     };


//     // function to handle user press on a pokemon
//     const handlePress = async (pokemon: Pokemon) => {
//         try {
//             // Fetch the complete details of the clicked Pokemon
//             const pokemonDetails = await fetchPokemonDetails(pokemon.id);
//             if (pokemonDetails) {
//                 // Pass the complete Pokemon details to the navigation
//                 navigation.navigate('Details', { pokemon: pokemonDetails });
//             } else {
//                 // Handle case when pokemon details are not found
//                 console.log('Pokemon details not found');
//                 // TODO: Show an alert, display an error message, etc.
//             }
//         } catch (error) {
//             // Handle error
//             console.error('Error handling Pokemon press on Pokemon screen:', error)
//             // TODO: Show an alert, display an error message, etc.
//         }
//     };

    // function to handle user press on a pokemon
    const handlePress = async (pokemon: Pokemon) => {
        navigation.navigate('Details', { pokemon });
    };

    // function to handle search query changes
    const handleSearchQueryChange = (query) => {
        setSearchQuery(query);
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

    const handleVersionSelect = (version: string) => {
      let updatedVersions: string[] = [];

      if (groupedVersions.hasOwnProperty(version)) {
        // If the selected version is a grouped version, handle it accordingly
        const range = groupedVersions[version];
        if (selectedVersions.includes(version)) {
          updatedVersions = selectedVersions.filter((v) => v !== version);
        } else {
          updatedVersions = [...selectedVersions, version];
        }
      } else {
        // If the selected version is not a grouped version, handle it as usual
        if (selectedVersions.includes(version)) {
          updatedVersions = selectedVersions.filter((v) => v !== version);
        } else {
          updatedVersions = [...selectedVersions, version];
        }
      }

      setSelectedVersions(updatedVersions);
    };

    // function to handle the filtering of pokemon
    const filterPokemon = (pokemonList, searchQuery, showFavorites, showCaughtPokemon) => {
        let filteredList = Object.values(pokemonList);

        if (showFavorites) {
            filteredList = filteredList.filter((pokemon) => pokemon.isFavorite);
        }

        if (showCaughtPokemon) {
            filteredList = filteredList.filter((pokemon) => pokemon.isCaptured);
        }

        if (selectedVersions.length > 0) {
            filteredList = filteredList.filter((pokemon) => {
                const matchesSelectedVersions = selectedVersions.some((version) => {
                    const range = groupedVersions[version];
                    return pokemon.id >= range.start && pokemon.id <= range.end;
                });
                return matchesSelectedVersions;
            });
        }

        if (searchQuery) {
            filteredList = filteredList.filter((pokemon) =>
                pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase())
            );
        }

        return filteredList;
    };


//     // function to handle the filtering of pokemon
//     const filterPokemonByVersions = (pokemonList, searchQuery) => {
//         if (selectedVersions.length === 0 && !searchQuery) {
//             return Object.values(pokemonList);
//         }
//
//         const filteredList = Object.values(pokemonList).filter((pokemon) => {
//             const matchesSelectedVersions = selectedVersions.some((version) => {
//                 const range = groupedVersions[version];
//                 return pokemon.id >= range.start && pokemon.id <= range.end;
//             });
//
//             if (selectedVersions.length > 0) {
//                 if (!matchesSelectedVersions) {
//                     return false;
//                 }
//             }
//
//             if (searchQuery) {
//                 return pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase());
//             }
//             return matchesSelectedVersions;
//         });
//
//         return filteredList
//     };

    const filteredPokemon = filterPokemon(pokemonList, searchQuery, showFavorites, showCaughtPokemon);


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
                                            onPress={() => handleFavoritePress(pokemon, database)}
                                        />
                                    ) : (
                                        <Ionicons
                                            name="star-outline"
                                            size={24} color="#555"
                                            onPress={() => handleFavoritePress(pokemon, database)}
                                        />
                                    )}
                                    {pokemon.isCaptured ? (
                                        <Ionicons
                                            name="checkmark-circle-outline"
                                            size={26} color="#555"
                                            onPress={() => handleCapturePress(pokemon, database)}
                                        />
                                    ) : (
                                        <Ionicons
                                            name="ellipse-outline"
                                            size={26} color="#555"
                                            onPress={() => handleCapturePress(pokemon, database)}
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
        if (filteredPokemon.length === 0) {
            return <Text>There are no results for {searchQuery}</Text>
        }

        return (
            <FlatList
                data={filteredPokemon}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                contentContainerStyle={styles.listContainer}

            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <Text style={styles.filterTitleText}>Filter by Versions:</Text>
                <View style={styles.filterButtonContainer}>
                    <FilterDropdownDrawer selectedVersions={selectedVersions} />
                    <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                            style={styles.dropdownTrigger}
                            onPress={() => setDropdownVisible(!dropdownVisible)}
                        >
                            <Text style={styles.dropdownTriggerText}>Select Generations</Text>
                        </TouchableOpacity>

                        {dropdownVisible && (
                            <View style={styles.dropdownContent}>
                                {versionOptions.map((range) => (
                                    <TouchableOpacity
                                        key={range.key}
                                        style={[
                                            styles.filterButton,
                                            {
                                                backgroundColor: selectedVersions.includes(range.key) ? 'blue' : 'gray',
                                            },
                                        ]}
                                        onPress={() => handleVersionSelect(range.key)}
                                    >
                                        <Text style={styles.filterButtonText}>{range.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor: showFavorites ? 'blue' : 'gray',
                            },
                        ]}
                        onPress={() => setShowFavorites(!showFavorites)}
                    >
                        <Text style={styles.filterButtonText}>Favorites</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor: showCaughtPokemon ? 'blue' : 'gray',
                            },
                        ]}
                        onPress={() => setShowCaughtPokemon(!showCaughtPokemon)}
                    >
                        <Text style={styles.filterButtonText}>Caught</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={handleSearchQueryChange}
                        placeholder="Search Pokemon"
                    />
                </View>
            </View>
            <View style={styles.pokemonListContainer}>
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
        zIndex: 2,
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
        zIndex: 3,
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
    filterButtonContainer: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    filterButton: {
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 3,
    },
    filterButtonText: {
        fontSize: 16,
        color: 'white',
    },
    searchContainer: {
        marginVertical: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 25,
        paddingVertical: 5,
    },
    listContainer: {
        alignItems: 'center',
    },
    pokemonListContainer: {
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



// const PokemonScreen = ({ navigation, typeData, route }: Props) => {
//     const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const dispatch = useDispatch();
//     const pokemonList = useSelector((state) => state.pokemon.pokemonList);
//
//     // function to handle user press on a pokemon
//     const handlePress = async (pokemon: Pokemon) => {
//         navigation.navigate('Details', { pokemon });
//     };
//
//     // function to handle search query changes
//     const handleSearchQueryChange = (query) => {
//         setSearchQuery(query);
//     };
//
//     const groupedVersions = {
//             gen1: { start: 1, end: 151 },
//             gen2: { start: 152, end: 251 },
//             gen3: { start: 252, end: 386 },
//             gen4: { start: 387, end: 493 },
//             gen5: { start: 494, end: 649 },
//             gen6: { start: 650, end: 721 },
//             gen7: { start: 722, end: 809 },
//             gen8: { start: 810, end: 905 },
//             gen9: { start: 906, end: 1010 },
//           };
//
//     const handleVersionSelect = (version: string) => {
//       let updatedVersions: string[] = [];
//
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
//
//     // function to handle the filtering of pokemon
//     const filterPokemonByVersions = (pokemonList: Pokemon[], searchQuery: string) => {
//         if (selectedVersions.length === 0 && !searchQuery) {
//             return pokemonList;
//         }
//
//         const filteredList = pokemonList.filter((pokemon) => {
//             const matchesSelectedVersions = selectedVersions.some((version) => {
//                 const range = groupedVersions[version];
//                 return pokemon.id >= range.start && pokemon.id <= range.end;
//             });
//
//             if (selectedVersions.length > 0) {
//                 if (!matchesSelectedVersions) {
//                     return false;
//                 }
//             }
//
//             if (searchQuery) {
//
//                 return pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase());
//             }
//             return matchesSelectedVersions;
//
//         });
//
//         return filteredList
//     };
//
//     const filteredPokemon = filterPokemonByVersions(pokemonList, searchQuery);
//
//
//     const handleFavoritePress = (selectedPokemon) => {
//         // Update the isFavorite value in the database
//         const updatedFavoriteValue = !selectedPokemon.isFavorite;
//
//         // pokemon action to update the pokemon in the pokemonList state
//         dispatch(updatePokemonFavoriteStatusAction(selectedPokemon.id, updatedFavoriteValue));
//     }
//
//     const handleCapturePress = (selectedPokemon) => {
//         // Update the isCaptured value in the database
//         const updatedCaptureValue = !selectedPokemon.isCaptured;
//
//         // pokemon action to update the pokemon in the pokemonList state
//         dispatch(updatePokemon(selectedPokemon.id, selectedPokemon.isFavorite, updatedCaptureValue));
//
//         // Update the database using the database update function
//         updatePokemonCaptureStatus(selectedPokemon.id, updatedCaptureValue);
//     }
//
//
//     const renderItem = ({ item: pokemon }: { item: Pokemon }) => {
//         const screenWidth = Dimensions.get('window').width;
//         // Width for one column
//         const itemWidth = screenWidth - 5;
//         const backgroundColor = pokemon.type1 ? pokemonColors[pokemon.type1].backgroundColor : '';
//         return (
//             <View style={[styles.itemContainer, { width: itemWidth, backgroundColor }]}>
//                 <TouchableOpacity style={styles.itemCard} onPress={() => handlePress(pokemon)}>
//                     <View style={styles.itemDetailsContainer}>
//                         <Text style={[styles.pokemonId, { color: pokemon.type1 ? pokemonColors[pokemon.type1].color : 'white' }]}>{pokemon.id}</Text>
//
//                         <View style={styles.pokemonNameAndTypeContainer}>
//                             <View style={styles.nameContainer}>
//                                 <Text style={[styles.pokemonName, { color: pokemonColors[pokemon.type1].color } ]}>{capitalizeString(pokemon.name)}</Text>
//                                 <View style={{ flexDirection: 'row' }}>
//                                     {pokemon.isFavorite ? (
//                                         <Ionicons
//                                             name="star"
//                                             size={24} color="#555"
//                                             onPress={() => handleFavoritePress(pokemon, database)}
//                                         />
//                                     ) : (
//                                         <Ionicons
//                                             name="star-outline"
//                                             size={24} color="#555"
//                                             onPress={() => handleFavoritePress(pokemon, database)}
//                                         />
//                                     )}
//                                     {pokemon.isCaptured ? (
//                                         <Ionicons
//                                             name="checkmark-circle-outline"
//                                             size={26} color="#555"
//                                             onPress={() => handleCapturePress(pokemon, database)}
//                                         />
//                                     ) : (
//                                         <Ionicons
//                                             name="ellipse-outline"
//                                             size={26} color="#555"
//                                             onPress={() => handleCapturePress(pokemon, database)}
//                                         />
//                                     )}
//                                 </View>
//                             </View>
//
//                             <View style={styles.pokemonTypesContainer}>
//                                 <Text style={styles.pokemonType}>{capitalizeString(pokemon.type1)}</Text>
//                                 {pokemon.type2 && (
//                                     <Text style={styles.pokemonType}>{capitalizeString(pokemon.type2)}</Text>
//                                 )}
//                             </View>
//                         </View>
//
//
//                     </View>
//                     <Image
//                         style={styles.image}
//                         source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
//                     />
//                 </TouchableOpacity>
//             </View>
//         );
//     };
//
//     const renderPokemonList = () => {
//         if (filteredPokemon.length === 0) {
//             return <Text>There are no results for {searchQuery}</Text>
//         }
//
//         return (
//             <FlatList
//                 data={filteredPokemon}
//                 renderItem={renderItem}
//                 keyExtractor={(item) => item.name}
//                 contentContainerStyle={styles.listContainer}
//
//             />
//         );
//     };
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.filterContainer}>
//                 <Text style={styles.filterTitleText}>Filter by Versions:</Text>
//                 <View style={styles.filterButtonContainer}>
//                     {versionOptions.map((range) => (
//                         <TouchableOpacity
//                             key={range.key}
//                             style={[
//                                 styles.filterButton,
//                                 {
//                                     backgroundColor: selectedVersions.includes(range.key) ? 'blue' : 'gray',
//                                 },
//                             ]}
//                             onPress={() => handleVersionSelect(range.key)}
//                         >
//                             <Text style={styles.filterButtonText}>{range.label}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//
//                 <View style={styles.searchContainer}>
//                     <TextInput
//                         style={styles.searchInput}
//                         value={searchQuery}
//                         onChangeText={handleSearchQueryChange}
//                         placeholder="Search Pokemon"
//                     />
//                 </View>
//             </View>
//             {renderPokemonList()}
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'white',
//     },
//     filterContainer: {
//         flexDirection: 'column',
//         alignItems: 'center',
//         marginVertical: 10,
//     },
//     filterTitleText: {
//         fontSize: 18,
//     },
//     filterButtonContainer: {
//         marginTop: 10,
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'center',
//     },
//     filterButton: {
//         paddingVertical: 5,
//         paddingHorizontal: 10,
//         borderRadius: 5,
//         marginHorizontal: 5,
//         marginVertical: 3,
//     },
//     filterButtonText: {
//         color: 'white',
//     },
//     searchContainer: {
//         marginVertical: 10,
//     },
//     searchInput: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         paddingHorizontal: 25,
//         paddingVertical: 5,
//     },
//     listContainer: {
//         alignItems: 'center',
//     },
//     itemContainer: {
//         marginVertical: 10,
//         // aspectRatio for two columns
// //         aspectRatio: 1,
//         aspectRatio: 5,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//     },
//     itemCard: {
//         height: '100%',
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingHorizontal: 20,
//     },
//     itemDetailsContainer: {
//         alignItems: 'flex-start',
//         flexDirection: 'row',
//         alignItems: 'center',
//         flex: 1,
//     },
//     pokemonId: {
//         fontSize: 16,
//         paddingRight: 40,
//     },
//     nameContainer: {
//         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         marginRight: 15,
//     },
//     pokemonName: {
//         fontSize: 20,
//         marginBottom: 10,
//         paddingRight: 15,
//     },
//     pokemonTypesContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     pokemonType: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         paddingHorizontal: 20,
//         marginRight: 15,
//         borderWidth: 1,
//         borderColor: '#555',
//         borderRadius: 10,
//         textAlign: 'center',
//     },
//     image: {
// //         width: 100,
// //         height: 100,
//         width: 75,
//         height: 75,
//     },
// });
//
// export default PokemonScreen;