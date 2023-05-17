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
                alignItems: 'flex-start',
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
                justifyContent: 'center',
                paddingBottom: 8,
            },
            pokedexEntry: {
                fontSize: 16,
                marginBottom: 12,
            },
            typesContainer: {
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: 16,
            },
            type: {
                paddingVertical: 9,
                paddingHorizontal: 16,
                borderRadius: 32,
                marginRight: 8,
                flexShrink: 1,
            },
            strengthWeaknessColumnContainer: {
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginTop: 2,
            },
            strengthWeaknessColumn: {
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
            },
            strengthWeaknessColumnHeading: {
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
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
                <View style={styles.strengthWeaknessColumnContainer}>
                    <View style={styles.strengthWeaknessColumn}>
                        <Text style={styles.strengthWeaknessColumnHeading}>Strong Against</Text>
                        <View>{/* Render the content for "Strong Against" */}</View>
                    </View>
                    <View style={styles.strengthWeaknessColumn}>
                        <Text style={styles.strengthWeaknessColumnHeading}>Weak Against</Text>
                        <View>
                        </View>
                    </View>
                    <View style={styles.strengthWeaknessColumn}>
                        <Text style={styles.strengthWeaknessColumnHeading}>No Damage From</Text>
                        <View>
                        </View>
                    </View>
                    <View style={styles.strengthWeaknessColumn}>
                        <Text style={styles.strengthWeaknessColumnHeading}>No Damage To</Text>
                        <View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PokemonCard;
