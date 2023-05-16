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
    { key: 'yellow', label: 'Red/Blue' },
    { key: 'silver', label: 'Silver/Gold' },
];

const PokemonScreen = ({ navigation, pokemonList, typeData }: Props) => {
    const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

    // function to handle user press on a pokemon
    const handlePress = async (pokemon: Pokemon) => {
        navigation.navigate('Details', { pokemon });
    };

    // function to handle selected generations for filter
    const handleVersionSelect = (version: string) => {
        if (selectedVersions.includes(version)) {
            setSelectedVersions(selectedVersions.filter((v) => v !== version));
        } else {
            setSelectedVersions([...selectedVersions, version]);
        }
    };

    // function to handle the filtering of pokemon
    const filterPokemonByVersions = (pokemonList: Pokemon[], selectedVersions: string[]) => {
        if (selectedVersions.length === 0) {
            return pokemonList;
        }

        return pokemonList.filter((pokemon) =>
            pokemon.game_indices.map((gameIndex) => gameIndex.version.name).some((version) =>
                selectedVersions.includes(version)
            )
        );
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