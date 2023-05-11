import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pokemon } from '../types';
import { getTypeStyle } from '../utils/typeStyle';

type Props = {
    navigation: StackNavigationProp<any>;
    pokemonList: Pokemon[];
    typeData: { [key: string]: typeData };
};

// // Function to grab pokedex entry
//     const getPokedexEntry = async (pokemon) => {
//         try {
//             const pokedexSpeciesDataResponse = await fetch(pokemon.species.url);
//             const pokedexSpeciesData = await pokedexSpeciesDataResponse.json();
//
//             console.log(pokedexSpeciesData)
//
//             const getEnglishPokedexEntry = (entryType) => {
//                 return new Promise((resolve, reject) => {
//                     let entries;
//
//                     if (entryType === "flavor_text") {
//                         entries = pokedexSpeciesData.flavor_text_entries;
//                     } else if (entryType === "genus") {
//                         entries = pokedexSpeciesData.genera;
//                     } else {
//                         reject("Invalid entry type");
//                     }
//
//                     for (const entry of entries) {
//                         if (entry.language.name === 'en') {
//                             resolve(entry[entryType].replace(/[\n\f]/g, " "));
//                         }
//                     }
//                     reject("No english pokedex entry found");
//                 });
//             };
//
//             const englishPokedexFlavorText = await getEnglishPokedexEntry("flavor_text");
//             const englishPokedexGenus = await getEnglishPokedexEntry("genus");
// //             setPokedexEntry({ genus: englishPokedexGenus, flavorText: englishPokedexFlavorText });
//             return { "genus": englishPokedexGenus, "flavorText": englishPokedexFlavorText};
//         } catch (error) {
//             throw error;
//         }
//     };

const PokemonScreen = ({ navigation, pokemonList, typeData }: Props) => {
//     console.log(typeData)
    const handlePress = async (pokemon: Pokemon) => {
        navigation.navigate('Details', { pokemon });
    };

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
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` }}
                    />
                </TouchableOpacity>
            </View>
        );
    };

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemonList}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
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