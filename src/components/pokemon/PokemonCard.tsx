import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTypeStyle } from '../../utils/typeStyle';

const PokemonCard = ({ pokemon, pokedexEntry, handlePress, getTypeBackgroundStyle, pokemonColors }) => {

    // Grab the dimensions of the device for sizing of components
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

    // Stylesheet for this screen
        const styles = StyleSheet.create({
            container: {
                height: '100%',
            },
            card: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: windowHeight * 0.75,
                borderWidth: 10,
                borderColor: '#5C6B7C',
                overflow: 'hidden',
                marginBottom: 20,
                fontFamily: 'Arial, sans-serif',
            },
            imageContainer: {
                backgroundColor: 'white',
                height: '50%',
                width: '100%',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            },
            image: {
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
            },
            nextPokemonButton: {
                position: 'absolute',
                top: '45%',
                right: 0,
            },
            prevPokemonButton: {
                position: 'absolute',
                top: '45%',
                left: 0,
            },
            idContainer: {
                position: 'absolute',
                top: 10,
                right: 10,
                borderRadius: 50,
                backgroundColor: '#5C6B7C',
                padding: 1,
                width: 60,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
            },
            idText: {
                color: 'white',
                fontSize: 22,
                fontWeight: 'bold',
            },
            evolutionContainer: {
                position: 'absolute',
                top: 10,
                left: 10,
                borderRadius: 50,
                backgroundColor: '#5C6B7C',
                padding: 1,
                width: 60,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
            },
            evolutionImage: {
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
            },
            bottomOfCard: {
                flexDirection: 'column',
                alignItems: 'center',
                padding: 20,
                paddingTop: 15,
                height: '50%',
                width: '100%',
            },
            normalCard: {
                backgroundColor: '#E0E0E0',
            },
            legendaryCard: {
                backgroundColor: 'gold',
            },
            heading: {
                fontSize: (30 - (pokemon.name.length + pokemon.types[0].type.name.length) / 4),
                fontWeight: 'bold',
                alignSelf: 'flex-start',
            },
            nameContainer: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                paddingBottom: 8,
            },
            pokedexEntry: {
                fontSize: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 5,
            },
            typesContainer: {
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: 16,
            },
            type: {
                paddingVertical: 3,
                paddingHorizontal: 16,
                borderRadius: 32,
                marginRight: 8,
                flexShrink: 1,
            },
            pokedexCardColumnsContainer: {
                width: '80%',
                flexDirection: 'row',
                justifyContent: 'space-between',
            },
            pokedexCardColumn: {
                flexDirection: 'column',
            },
            pokedexCardEntryTitle: {
                color: '#999',
                textAlign: 'left',
                paddingLeft: 6,
            },
            pokedexCardEntryInfo: {
                width: '100%',
                textAlign: 'center',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 8,
                marginBottom: 8,
            },
        });

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={{ uri: `${pokemon.sprites.other['official-artwork'].front_default}` }}
                />
                <View style={styles.idContainer}>
                    <Text style={styles.idText}>
                        {pokemon.id > 100 ? pokemon.id : pokemon.id > 10 ? '0' + pokemon.id : '00' + pokemon.id}
                    </Text>
                </View>

                <TouchableOpacity style={styles.prevPokemonButton} onPress={() => handlePress(pokemon.id - 1 > 0 ? pokemon.id - 1 : 1010)}>
                    <Ionicons name="chevron-back-outline" size={50} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextPokemonButton} onPress={() => handlePress(pokemon.id + 1 <= 1010 ? pokemon.id + 1 : 1)}>
                    <Ionicons name="chevron-forward-outline" size={50} color="black" />
                </TouchableOpacity>
            </View>

            <View style={[styles.bottomOfCard, pokedexEntry.isLegendary ? styles.legendaryCard : styles.normalCard]}>
                <View style={styles.nameContainer}>
                    <Text style={styles.heading}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
                    <View style={styles.typesContainer}>
                        {pokemon.types.map((type, index) => (
                            <View key={type.type.name} style={[styles.type, { backgroundColor: pokemonColors[index].backgroundColor } ]}>
                                <Text style={{ color: pokemonColors[index].color, fontSize: 18, fontWeight: '600' }}>
                                    {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View>
                    <Text style={styles.pokedexEntry}>{pokedexEntry.flavorText}</Text>
                </View>
                <View style={styles.pokedexCardColumnsContainer}>
                    <View style={styles.pokedexCardColumn}>
                        <Text style={styles.pokedexCardEntryTitle}>Height</Text>
                        <Text style={styles.pokedexCardEntryInfo}>{Math.floor((pokemon.height * 3.937) / 12)}'{Math.round((pokemon.height * 3.937) % 12)}" ({pokemon.height / 10} m)</Text>
                        <Text style={styles.pokedexCardEntryTitle}>Weight</Text>
                        <Text style={styles.pokedexCardEntryInfo}>{(pokemon.weight / 4.536).toFixed(0)} lbs ({pokemon.weight / 10} kg)</Text>
                    </View>
                    <View style={styles.pokedexCardColumn}>
                        <Text style={styles.pokedexCardEntryTitle}>Species</Text>
                        <Text style={styles.pokedexCardEntryInfo}>{pokedexEntry.genus}</Text>
                        <Text style={styles.pokedexCardEntryTitle}>Habitat</Text>
                        <Text style={styles.pokedexCardEntryInfo}>{pokedexEntry.habitat}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PokemonCard;
