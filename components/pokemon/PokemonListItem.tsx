// Dependencies
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
// Components
import { IconContainer } from 'components/card/IconContainer';
// Utils
import { capitalizeString, pokemonColors } from 'utils/helpers';
import { useBottomSheet } from 'contexts/BottomSheetContext';


export const PokemonListItem = React.memo(({ pokemon }: any) => {
  const type1 = useMemo(() => pokemon.pokemon_v2_pokemontypes[0].pokemon_v2_type.name, [pokemon]);
  const type2 = useMemo(() => pokemon.pokemon_v2_pokemontypes[1]?.pokemon_v2_type.name, [pokemon]);
  const { closeBottomSheet } = useBottomSheet();

  const backgroundColor = useMemo(() => pokemonColors[type1].backgroundColor, [type1]);
  const textColor = useMemo(() => pokemonColors[type1].color, [type1]);

  const typesContainer = (
    <View style={styles.pokemonTypesContainer}>
      <Text style={[styles.pokemonType, { color: textColor }]}>{capitalizeString(type1)}</Text>
      {type2 && <Text style={[styles.pokemonType, { color: textColor }]}>{capitalizeString(type2)}</Text>}
    </View>
  );

  return (
    <TouchableOpacity 
      onPress={() => {
        router.push(`/pokemon/${pokemon.id}`)
        closeBottomSheet()
      }} 
      style={[styles.itemContainer, { backgroundColor } ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.pokemonId, { color: textColor }]}>{pokemon.id}</Text>
      <View style={styles.itemDetailsContainer}>
        <View style={styles.nameAndIconContainer}>
          <Text style={[styles.pokemonName, { color: textColor } ]}>{capitalizeString(pokemon.name)}</Text>
          <IconContainer item={pokemon} title='pokemon' />
        </View>
        {typesContainer}
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
          contentFit="contain"
          transition={0}
          recyclingKey={pokemon.name}
        />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  itemDetailsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  pokemonId: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  nameAndIconContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  pokemonName: {
    fontSize: 20,
    marginRight: 15,
  },
  pokemonTypesContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  pokemonType: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#555',
    textAlign: 'center',
  },
  imageContainer: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
});