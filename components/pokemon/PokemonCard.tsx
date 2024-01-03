import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import { Image } from "expo-image";
import Ionicons from '@expo/vector-icons/Ionicons';
import { capitalizeString, pokemonColors } from '../../utils/helpers';

export const PokemonCard = ({ pokemon, pokemonDetails }) => {

    // Grab the dimensions of the device for sizing of components
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

            // Stylesheet for this screen
            const styles = StyleSheet.create({
                card: {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginBottom: 20,
                    overflow: 'hidden',
                },
                imageContainer: {
                    backgroundColor: pokemonColors[pokemon?.pokemon_v2_pokemontypes[0].pokemon_v2_type.name].backgroundColor,
                    height: windowHeight * 0.30,
                    width: '100%',
                    paddingTop: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                imageBottomBackground: {
                    position: 'absolute',
                    bottom: 0,
                    height: '50%',
                    width: '100%',
                    backgroundColor: 'white',
                    borderTopRightRadius: 24,
                    borderTopLeftRadius: 24,
                },
                image: {
                    width: '80%',
                    height: '90%',
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
                    backgroundColor: 'white',
                    padding: 1,
                    width: 60,
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                idText: {
                    fontSize: 22,
                    fontWeight: 'bold',
                },
                bottomOfCard: {
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingBottom: 10,
                    width: '100%',
                    backgroundColor: 'white',
                },
                heading: {
                    fontSize: (48 - (pokemon.name.length / 4)),
                    fontWeight: 'bold',
                    alignSelf: 'center',
                },
                nameContainer: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                abilitiesContainer: {
                    width: '90%',
                },
                abilitiesTitle: {
                    textAlign: 'center',
                    fontSize: 18,
                    marginBottom: 20,
                    paddingBottom: 5,
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                },
                abilityContainer: {
                    backgroundColor: pokemonColors[pokemon?.pokemon_v2_pokemontypes[0].pokemon_v2_type.name].backgroundColor,
                    borderRadius: 15,
                    alignItems: 'center',
                    marginBottom: 15,
                    padding: 5,
                },
                abilityItem: {
                    fontSize: 16,
                    color: pokemonColors[pokemon?.pokemon_v2_pokemontypes[0].pokemon_v2_type.name].color,
                    fontWeight: 'bold',
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
                    backgroundColor: pokemonColors[pokemon?.pokemon_v2_pokemontypes[0].pokemon_v2_type.name].backgroundColor,
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

return (
  <View style={styles.card}>
    <View style={styles.imageContainer}>
      <View style={styles.imageBottomBackground}></View>
        <Image
          style={styles.image}
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
          contentFit="contain"
          transition={500}
        />
        <View style={styles.idContainer}>
          <Text style={styles.idText}>
            {pokemon.id > 100 ? pokemon.id : pokemon.id > 10 ? '0' + pokemon.id : '00' + pokemon.id}
          </Text>
        </View>
      </View>

      <View style={styles.bottomOfCard}>
        <View style={styles.nameContainer}>
          <Text style={styles.heading}>{capitalizeString(pokemon.name)}</Text>
        </View>
        <View style={styles.typesContainer}>
          <View 
            style={[styles.type, { backgroundColor: pokemonColors[pokemon?.pokemon_v2_pokemontypes[0].pokemon_v2_type.name].backgroundColor } ]}
          >
            <Text style={{ color: pokemonColors[pokemon?.pokemon_v2_pokemontypes[0].pokemon_v2_type.name].color, fontSize: 18, fontWeight: '600' }}>
              {capitalizeString(pokemon.pokemon_v2_pokemontypes[0].pokemon_v2_type.name)}
            </Text>
          </View>
          {pokemon.pokemon_v2_pokemontypes[1] ? (
            <View 
              style={[styles.type, { backgroundColor: pokemonColors[pokemon?.pokemon_v2_pokemontypes[1].pokemon_v2_type.name].backgroundColor } ]}
            >
              <Text style={{ color: pokemonColors[pokemon.pokemon_v2_pokemontypes[1].pokemon_v2_type.name].color, fontSize: 18, fontWeight: '600' }}>
                {capitalizeString(pokemon.pokemon_v2_pokemontypes[1].pokemon_v2_type.name)}
              </Text>
            </View>
          ) : null}
        </View>
        <Text>{pokemon.id}</Text>
        <Text>{pokemon.name}</Text>
        {pokemon.isFavorited ? <Text>Pokemon is favorited!</Text> : null}
        {pokemon.isCaught ? <Text>Pokemon has been caught!</Text> : null}
        <Text>{pokemon.pokemon_v2_pokemontypes[0].pokemon_v2_type.name}</Text>
        {pokemon.pokemon_v2_pokemontypes[1] ? (
          <Text>{pokemon.pokemon_v2_pokemontypes[1].pokemon_v2_type.name}</Text>
        ) : null}
        <Text>POKEMON DETAILS</Text>
        <Text>ID: {pokemonDetails.id}</Text>
        <Text>HEIGHT: {pokemonDetails.height}</Text>
        <Text>WEIGHT: {pokemonDetails.weight}</Text>
        <Text>BASE EXPERIENCE: {pokemonDetails.base_experience}</Text>
        <Text>ABILITIES</Text>
        <Text>{pokemonDetails.pokemon_v2_pokemonabilities[0].pokemon_v2_ability.name}</Text>
        <Text>{pokemonDetails.pokemon_v2_pokemonabilities[0].pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0].effect}</Text>
        <Text>{pokemonDetails.pokemon_v2_pokemonabilities[0].pokemon_v2_ability.pokemon_v2_abilityflavortexts[0].effect}</Text>
        <Text>{pokemonDetails.pokemon_v2_pokemonabilities[1].pokemon_v2_ability.name}</Text>
        <Text>{pokemonDetails.pokemon_v2_pokemonabilities[1].pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0].effect}</Text>
        <Text>{pokemonDetails.pokemon_v2_pokemonabilities[1].pokemon_v2_ability.pokemon_v2_abilityflavortexts[0].effect}</Text>
        <Text>BASE HAPPINESS: {pokemonDetails.pokemon_v2_pokemonspecy.base_happiness}</Text>
        <Text>IS BABY: {pokemonDetails.pokemon_v2_pokemonspecy.is_baby}</Text>
        <Text>IS LEGENDARY: {pokemonDetails.pokemon_v2_pokemonspecy.is_legendary}</Text>
        <Text>IS MYTHICAL: {pokemonDetails.pokemon_v2_pokemonspecy.is_mythical}</Text>
        <Text>EVOLUTION CHAIN:</Text>
        {pokemonDetails.pokemon_v2_pokemonspecy.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.map((evolution) => (
          <Text>EVOLUTION ID: {evolution.id}</Text>
        ))}
        <Text>HABITAT: {pokemonDetails.pokemon_v2_pokemonspecy.pokemon_v2_pokemonhabitat.name}</Text>
        <Text>STATS: </Text>
        {pokemonDetails.pokemon_v2_pokemonstats.map((stat) => (
          <View>
            <Text>{stat.pokemon_v2_stat.name}: {stat.base_stat}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};