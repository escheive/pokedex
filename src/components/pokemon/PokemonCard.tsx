import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTypeStyle } from '../../utils/typeStyle';
import { capitalizeString } from '../../utils/helpers';

const PokemonCard = ({ pokemon, pokedexEntry, pokemonAbilities, handlePress, getTypeBackgroundStyle, pokemonColors }) => {
    const [selectedAbility, setSelectedAbility] = useState(null);

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
                fontSize: (30 - (pokemon.name.length + pokemon.type1.length) / 4),
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
                width: '100%',
                textAlign: 'center',
                fontSize: 16,
                marginBottom: 12,
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
                width: '100%',
                flexDirection: 'row',
//                 justifyContent: 'center',
                justifyContent: 'space-around',
            },
            pokedexCardColumn: {
                width: '40%',
                flexDirection: 'column',
            },
            pokedexCardEntryTitle: {
                color: '#777',
                textAlign: 'left',
                paddingLeft: 6,
            },
            pokedexCardEntryInfo: {
                width: '100%',
                textAlign: 'center',
                color: '#555',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                paddingHorizontal: 18,
                paddingVertical: 10,
                marginBottom: 8,
            },
            abilitiesTitle: {
                fontSize: 18,
                marginBottom: 10,
            },
            abilityContainer: {
                width: '90%',
                backgroundColor: pokemonColors[pokemon.type1].backgroundColor,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 15,
                alignItems: 'center',
                marginBottom: 15,
                padding: 5,
            },
            abilityItem: {
                fontSize: 16,
            },
            modalContainer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            modalContent: {
                alignItems: 'center',
                backgroundColor: '#ccc',
                width: '90%',
                borderRadius: 16,
            },
              modalTitle: {
                textAlign: 'center',
                width: '100%',
                fontSize: 24,
                fontWeight: 'bold',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                backgroundColor: pokemonColors[pokemon.type1].backgroundColor,
                color: 'white',
                paddingVertical: 16,
              },
              modalDefinitionContainer: {
                backgroundColor: '#fff',
                width: '100%',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
              },
              modalDefinition: {
                fontSize: 18,
                color: 'gray',
                padding: 10,
                width: '100%',
                borderRadius: 12,
                textAlign: 'center',
                marginVertical: 30,
              },
        });


//         <View style={styles.pokedexCardColumnsContainer}>
//                             <View style={styles.pokedexCardColumn}>
//                                 <Text style={styles.pokedexCardEntryTitle}>Height</Text>
//                                 <Text style={styles.pokedexCardEntryInfo}>{Math.floor((pokemon.height * 3.937) / 12)}'{Math.round((pokemon.height * 3.937) % 12)}" ({pokemon.height / 10} m)</Text>
//                                 <Text style={styles.pokedexCardEntryTitle}>Weight</Text>
//                                 <Text style={styles.pokedexCardEntryInfo}>{(pokemon.weight / 4.536).toFixed(0)} lbs ({pokemon.weight / 10} kg)</Text>
//                             </View>
//                             <View style={styles.pokedexCardColumn}>
//                                 <Text style={styles.pokedexCardEntryTitle}>Species</Text>
//                                 <Text style={styles.pokedexCardEntryInfo}>{pokedexEntry.genus}</Text>
//                                 <Text style={styles.pokedexCardEntryTitle}>Habitat</Text>
//                                 <Text style={styles.pokedexCardEntryInfo}>{pokedexEntry.habitat}</Text>
//                             </View>
//                         </View>

    const handleAbilitySelect = (ability) => {
        setSelectedAbility(ability)
    };

    console.log(pokemon)

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={{ uri: `${pokemon.image_url}` }}
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
                        <View style={[styles.type, { backgroundColor: pokemonColors[pokemon.type1].backgroundColor } ]}>
                            <Text style={{ color: pokemonColors[pokemon.type1].color, fontSize: 18, fontWeight: '600' }}>
                                {capitalizeString(pokemon.type1)}
                            </Text>
                        </View>
                        {pokemon.type2 ? (
                            <View style={[styles.type, { backgroundColor: pokemonColors[pokemon.type2].backgroundColor } ]}>
                                <Text style={{ color: pokemonColors[pokemon.type2].color, fontSize: 18, fontWeight: '600' }}>
                                    {capitalizeString(pokemon.type2)}
                                </Text>
                            </View>
                        ) : null}
                    </View>

                </View>

                <Text style={styles.pokedexEntry}>{pokedexEntry.flavorText}</Text>
                <Text style={styles.abilitiesTitle}>Abilities</Text>
                {pokemonAbilities.map((ability) => (
                    <TouchableOpacity
                        key={ability.name}
                        style={styles.abilityContainer}
                        onPress={() => handleAbilitySelect(ability)}
                    >
                        <Text style={styles.abilityItem}>{ability.name}</Text>
                    </TouchableOpacity>
                ))}

                <Modal visible={selectedAbility !== null} animationType="fade" transparent>
                    <TouchableOpacity
                        style={styles.modalContainer}
                        activeOpacity={1}
                        onPress={() => setSelectedAbility(null)}
                    >
                        <TouchableOpacity
                            style={styles.modalContent}
                            activeOpacity={1}
                            onPress={() => {}}
                        >
                            <Text style={styles.modalTitle}>{selectedAbility?.name}</Text>
                            <View style={styles.modalDefinitionContainer}>
                                <Text style={styles.modalDefinition}>{selectedAbility?.definition}</Text>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

            </View>
        </View>
    );
};

export default PokemonCard;
