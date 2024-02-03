import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import { Image } from "expo-image";
import Ionicons from '@expo/vector-icons/Ionicons';
import { capitalizeString, pokemonColors } from '../../utils/helpers';
import { IconContainer } from 'components/card/IconContainer';
import { Pokemon } from 'types';


interface PokemonCardProps {
  pokemon: Pokemon;
}


export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [selectedAbility, setSelectedAbility] = useState<any | null>(null);

  const backgroundColor = pokemonColors[pokemon?.pokemon_v2_pokemontypes[0].pokemon_v2_type.name].backgroundColor;
  const color = pokemonColors[pokemon?.pokemon_v2_pokemontypes[0].pokemon_v2_type.name].color;


  const PokemonDetailsGroup = ({values, titles}: any) => {
    const width = 1 / titles.length * 100

    return (
      <View style={styles.pokemonDetailsGroup}>
        {titles.map((title, index) => (
          <View 
            key={index}
            style={[styles.pokemonDetailsSubGroup, { width: `${width}%` }]}
          >
            <Text style={styles.pokemonDetailsValue}>{values[index]}</Text>
            <Text style={styles.pokemonDetailsText}>{title}</Text>
          </View>
        ))}
      </View>
    )
  }


  return (
    <View style={styles.card}>
      <View style={[styles.imageContainer, { backgroundColor } ]}>
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
          <Text style={[
            styles.heading, { fontSize: (48 - (pokemon.name.length / 4)) }
          ]}>
            {capitalizeString(pokemon.name)}
          </Text>
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

        <IconContainer item={pokemon} title='pokemon' />

        <View style={styles.abilitiesContainer}>
          <Text style={styles.abilitiesTitle}>Abilities</Text>

          {pokemon.pokemon_v2_pokemonabilities.map((ability) => (
            <TouchableOpacity
              key={ability.pokemon_v2_ability.name}
              style={[styles.abilityContainer, { backgroundColor } ]}
              onPress={() => setSelectedAbility(ability.pokemon_v2_ability)}
            >
              <Text style={[styles.abilityItem, { color }]}>{capitalizeString(ability.pokemon_v2_ability.name)}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
              <Text style={[styles.modalTitle, { backgroundColor } ]}>{selectedAbility?.name}</Text>
              <View style={styles.modalDefinitionContainer}>
                <Text style={styles.modalDefinition}>{selectedAbility?.pokemon_v2_abilityeffecttexts[0]?.short_effect}</Text>
                <Text>{selectedAbility?.pokemon_v2_abilityeffecttexts[0].effect}</Text>
                <Text>{selectedAbility?.pokemon_v2_abilityflavortexts[0].flavor_text}</Text>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <View style={styles.pokemonDetailsContainer}>

          <PokemonDetailsGroup
            values={[
              pokemon.weight, 
              pokemon.height, 
            ]}
            titles={['WEIGHT', 'HEIGHT']}
          />

          <PokemonDetailsGroup
            values={[
              pokemon.base_experience, 
              pokemon.pokemon_v2_pokemonspecy.base_happiness, 
            ]}
            titles={['BASE EXPERIENCE', 'BASE HAPPINESS']}
          />

          <PokemonDetailsGroup
            values={[
              pokemon.pokemon_v2_pokemonspecy.is_baby ? 'YES' : '-', 
              pokemon.pokemon_v2_pokemonspecy.is_legendary ? 'YES' : '-', 
              pokemon.pokemon_v2_pokemonspecy.is_mythical ? 'YES' : '-' 
            ]}
            titles={['IS BABY', 'IS LEGENDARY', 'IS MYTHICAL']}
          />

          <PokemonDetailsGroup
            values={[
              capitalizeString(pokemon.pokemon_v2_pokemonspecy.pokemon_v2_pokemonhabitat?.name)
            ]}
            titles={['HABITAT']}
          />
          
        </View>
      </View>
    </View>
  );
};

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
    height: (Dimensions.get('window').height * 0.30),
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
    marginBottom: 32,
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
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    padding: 5,
  },
  abilityItem: {
    fontSize: 16,
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
  pokemonDetailsContainer: {
    width: '100%',
    padding: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 16,
    borderColor: '#bbb',
  },
  pokemonDetailsGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  pokemonDetailsSubGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    width: '50%'
  },
  pokemonDetailsValue: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 8,
    color: '#555',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center'
  },
  pokemonDetailsText: {
    color: '#aaa',
    textAlign: 'center',
    fontWeight: 'bold'
  },
});