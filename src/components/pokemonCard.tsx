import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './CardStyles'; // Import your card styles from the CSS file

const Card = ({ pokemon, pokedexEntry, handlePress, handlePrevEvolution }) => {

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
                {pokedexEntry.evolvesFrom !== null && (
                    <TouchableOpacity style={styles.evolutionContainer} onPress={() => handlePrevEvolution(pokemon.id)}>
                        <Image
                            style={styles.evolutionImage}
                            source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id - 1}.png` }}
                        />
                    </TouchableOpacity>
                )}

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
                        {pokemon.types.map((type) => (
                            <View key={type.type.name} style={[styles.type, ...getTypeBackgroundStyle([type])]}>
                                <Text style={{ color: getTypeStyle(type.type.name).color, fontSize: 18, fontWeight: '600' }}>
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
    );
};

export default pokemonCard;
