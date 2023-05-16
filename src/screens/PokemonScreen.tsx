import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Image, Dimensions, Switch, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pokemon } from '../types';
import { getTypeStyle } from '../utils/typeStyle';

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

const PokemonScreen = ({ navigation, pokemonList, typeData }: Props) => {
    const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
    const [excludeMetapod, setExcludeMetapod] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // function to handle user press on a pokemon
    const handlePress = async (pokemon: Pokemon) => {
        navigation.navigate('Details', { pokemon });
    };

    // function to handle search query changes
    const handleSearchQueryChange = (query) => {
        setSearchQuery(query);
    };

    // function to handle selected generations for filter
//     const handleVersionSelect = (version: string) => {
//         if (selectedVersions.includes(version)) {
//             setSelectedVersions(selectedVersions.filter((v) => v !== version));
//         } else {
//             setSelectedVersions([...selectedVersions, version]);
//         }
//     };

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
    const filterPokemonByVersions = (pokemonList: Pokemon[], searchQuery: string) => {
        if (selectedVersions.length === 0 && !searchQuery) {
            return pokemonList;
        }

        return pokemonList.filter((pokemon) => {
            const generationKey = selectedVersions.find((v) => groupedVersions.hasOwnProperty(v));
            if (generationKey) {
                const range = groupedVersions[generationKey];
                return pokemon.id >= range.start && pokemon.id <= range.end;
            }

            if (excludeMetapod && pokemon.name === 'metapod') {
                return false;
            }

            if (searchQuery) {
                const lowerCaseQuery = searchQuery.toLowerCase();
                return pokemon.name.toLowerCase().includes(lowerCaseQuery);
            }

            return false;
        });
    };

    const filteredPokemon = filterPokemonByVersions(pokemonList, searchQuery);


    const renderItem = ({ item: pokemon }: { item: Pokemon }) => {
        const screenWidth = Dimensions.get('window').width;
        // Width for two columns
//         const itemWidth = screenWidth / 2 - 15;
        // Width for one column
        const itemWidth = screenWidth - 5;
//         const typeData = typesData[pokemon.types[0].type.name];
//         console.log(typeData)
        const backgroundColor = (getTypeStyle(pokemon.types[0].type.name)).backgroundColor;
        return (
            <View style={[styles.itemContainer, { width: itemWidth, backgroundColor }]}>
                <TouchableOpacity style={styles.itemCard} onPress={() => handlePress(pokemon)}>
                    <View style={styles.itemDetailsContainer}>
                        <Text style={styles.pokemonId}>{pokemon.id}</Text>
                        <Text style={styles.pokemonName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
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

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={handleSearchQueryChange}
                        placeholder="Search Pokemon"
                    />
                </View>

                <View style={styles.excludeContainer}>
                    <Text>Exclude Metapod:</Text>
                    <Switch
                        value={excludeMetapod}
                        onValueChange={(value) => setExcludeMetapod(value)}
                    />
                </View>

            </View>
            {renderPokemonList()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    filterContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10,
    },
    filterTitleText: {
        fontSize: 18,
    },
    filterButtonContainer: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    filterButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 3,
    },
    filterButtonText: {
        color: 'white',
    },
    excludeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
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
        padding: 5,
    },
    itemContainer: {
        marginVertical: 10,
        // aspectRatio for two columns
//         aspectRatio: 1,
        aspectRatio: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        margin: 5,
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
        color: 'white',
        paddingRight: 20,
    },
    pokemonName: {
        fontSize: 20,
        marginVertical: 5,
        color: 'white',
    },
    image: {
//         width: 100,
//         height: 100,
        width: 75,
        height: 75,
    },
});

export default PokemonScreen;