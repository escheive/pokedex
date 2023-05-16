import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Image, Dimensions, Switch } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pokemon } from '../types';
import { getTypeStyle } from '../utils/typeStyle';

type Props = {
    navigation: StackNavigationProp<any>;
    pokemonList: Pokemon[];
    typeData: { [key: string]: typeData };
};

const versionOptions = [
    { key: 'red', label: 'Gen 1' },
    { key: 'gold', label: 'Gen 2' },
    { key: 'ruby', label: 'Gen 3' },
    { key: 'diamond', label: 'Gen 4' },
    { key: 'black', label: 'Gen 5' },
    { key: 'x', label: 'Gen 6' },
    { key: 'moon', label: 'Gen 7' },
    { key: 'sword', label: 'Gen 8' },
    { key: 'scarlet', label: 'Gen 9' },
];

const PokemonScreen = ({ navigation, pokemonList, typeData }: Props) => {
    const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

    // function to handle user press on a pokemon
    const handlePress = async (pokemon: Pokemon) => {
        navigation.navigate('Details', { pokemon });
    };

    // function to handle selected generations for filter
//     const handleVersionSelect = (version: string) => {
//         if (selectedVersions.includes(version)) {
//             setSelectedVersions(selectedVersions.filter((v) => v !== version));
//         } else {
//             setSelectedVersions([...selectedVersions, version]);
//         }
//     };


    const handleVersionSelect = (version: string) => {
      let updatedVersions: string[] = [];
      const groupedVersions = {
        red: ['red', 'blue', 'yellow'],
        gold: ['gold', 'silver', 'crystal'],
        ruby: ['ruby', 'sapphire', 'emerald'],
        diamond: ['diamond', 'pearl', 'platinum'],
        black: ['black', 'white'],
        x: ['x', 'y'],
        moon: ['moon', 'sun'],
        sword: ['sword', 'shield'],
        scarlet: ['scarlet', 'violet'],
      };

      if (groupedVersions.hasOwnProperty(version)) {
        // If the selected version is a grouped version, handle it accordingly
        const versionsToAdd = groupedVersions[version];
        if (selectedVersions.includes(version)) {
          updatedVersions = selectedVersions.filter((v) => !versionsToAdd.includes(v));
        } else {
          updatedVersions = [...selectedVersions, ...versionsToAdd];
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
    const filterPokemonByVersions = (pokemonList: Pokemon[], selectedVersions: string[]) => {
        if (selectedVersions.length === 0) {
            return pokemonList;
        }

        return pokemonList.filter((pokemon) => {
            if (pokemon.game_indices.length === 0) {
                return false;
            }

            return selectedVersions.includes(pokemon.game_indices[0].version.name)
        });
    };


    const filteredPokemon = filterPokemonByVersions(pokemonList, selectedVersions);


    const renderItem = ({ item: pokemon }: { item: Pokemon }) => {
        const screenWidth = Dimensions.get('window').width;
        const itemWidth = screenWidth / 2 - 15;
//         const typeData = typesData[pokemon.types[0].type.name];
//         console.log(typeData)
        const backgroundColor = (getTypeStyle(pokemon.types[0].type.name)).backgroundColor;
        return (
            <View style={[styles.itemContainer, { width: itemWidth, backgroundColor }]}>
                <TouchableOpacity style={styles.itemCard} onPress={() => handlePress(pokemon)}>
                    <Text>{pokemon.id}</Text>
                    <Text style={styles.pokemonName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
                    <Image
                        style={styles.image}
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
                    />
                </TouchableOpacity>
            </View>
        );
    };


return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <Text>Filter by Versions:</Text>
                {versionOptions.map((option) => (
                    <View key={option.key} style={styles.switchContainer}>
                        <Switch
                            value={selectedVersions.includes(option.key)}
                            onValueChange={() => handleVersionSelect(option.key)}
                        />
                        <Text>{option.label}</Text>
                  </View>
                ))}



            </View>
            <FlatList
                data={filteredPokemon}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                contentContainerStyle={styles.listContainer}
                numColumns={2}
            />
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    listContainer: {
        padding: 5,
    },
    itemContainer: {
        marginVertical: 10,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        margin: 5,
    },
    itemCard: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 18,
        marginVertical: 5,
        color: 'white',
    },
    image: {
        width: 100,
        height: 100,
    },
});

export default PokemonScreen;