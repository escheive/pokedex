import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { pokemonColors } from '../../utils/typeStyle';
import { capitalizeString } from '../../utils/helpers';

const PokemonImage = ({ pokemon, pokedexEntry, handlePress, handlePrevEvolution }) => {

    // Grab the dimensions of the device for sizing of components
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

    // Stylesheet for this screen
        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                height: windowHeight * 0.18,
                paddingVertical: 16,
                paddingHorizontal: 5,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#ccc',
            },
            imageContainer: {
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                backgroundColor: 'white',
                flex: 3,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
            },
            image: {
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
            },
            detailsContainer: {
                flex: 4,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 5,
            },
            nameContainer: {
                flexDirection: 'row',
            },
            idText: {
                fontSize: 22,
                marginRight: 8,
                fontWeight: 'bold',
            },
            pokemonName: {
                fontSize: 22,
                fontWeight: 'bold',
            },
            typesContainer: {
                flexDirection: 'row',
                marginVertical: 10,
            },
            type: {
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 20,
                paddingHorizontal: 10,
                marginHorizontal: 4,
            },
            typesText: {
                fontSize: 18,
                fontWeight: 'bold',
                marginHorizontal: 2,
            },
        });

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={{ uri: `${pokemon.image_url}` }}
                />
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.idText}>
                        {pokemon.id > 100 ? `#${pokemon.id}` : pokemon.id > 10 ? '#0' + pokemon.id : '#00' + pokemon.id}
                    </Text>
                    <Text style={styles.pokemonName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
                </View>

                <View style={styles.typesContainer}>
                    <View style={[styles.type, { backgroundColor: pokemonColors[pokemon.type1].backgroundColor } ]}>
                        <Text style={[ styles.typesText, { color: pokemonColors[pokemon.type1].color } ]}>
                            {capitalizeString(pokemon.type1)}
                        </Text>
                    </View>
                    {pokemon.type2 ? (
                        <View style={[styles.type, { backgroundColor: pokemonColors[pokemon.type2].backgroundColor } ]}>
                            <Text style={[ styles.typesText, { color: pokemonColors[pokemon.type1].color } ]}>
                                {capitalizeString(pokemon.type2)}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </View>
    );
};

export default PokemonImage;
