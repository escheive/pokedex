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
          updatedVersions = selectedVersions.filter((v) => !v.includes(v));
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
    const filterPokemonByVersions = (pokemonList: Pokemon[], selectedVersions: string[]) => {
        if (selectedVersions.length === 0) {
            return pokemonList;
        }

        return pokemonList.filter((pokemon) => {
            const generationKey = selectedVersions.find((v) => groupedVersions.hasOwnProperty(v));
            if (generationKey) {
                const range = groupedVersions[generationKey];
                return pokemon.id >= range.start && pokemon.id <= range.end;
            }
            return false;
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

//     {versionOptions.map((option) => (
//                         <View key={option.key} style={styles.switchContainer}>
//                             <Switch
//                                 value={selectedVersions.includes(option.key)}
//                                 onValueChange={() => handleVersionSelect(option.key)}
//                             />
//                             <Text>{option.label}</Text>
//                       </View>
//                     ))}


return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <Text>Filter by Versions:</Text>
                {versionOptions.map((range) => (
                    <TouchableOpacity
                        key={range.key}
                        style={[
                            styles.rangeButton,
                            {
                                backgroundColor: selectedVersions.includes(range.key) ? 'blue' : 'gray',
                            },
                        ]}
                        onPress={() => handleVersionSelect(range.key)}
                    >
                        <Text style={styles.rangeButtonText}>{range.label}</Text>
                    </TouchableOpacity>
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