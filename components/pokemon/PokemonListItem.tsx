// Dependencies
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useApolloClient } from '@apollo/client';
// Components
import { IconContainer } from 'components/card/IconContainer';
// Utils
import { capitalizeString, pokemonColors } from 'utils/helpers';


export const PokemonListItem = React.memo(({ pokemon }: any) => {
  const type1 = useMemo(() => pokemon.pokemon_v2_pokemontypes[0].pokemon_v2_type.name, [pokemon]);
  const type2 = useMemo(() => pokemon.pokemon_v2_pokemontypes[1]?.pokemon_v2_type.name, [pokemon]);

  const backgroundColor = useMemo(() => pokemonColors[type1].backgroundColor, [type1]);
  const textColor = useMemo(() => pokemonColors[type1].color, [type1]);

    const typesContainer = (
      <View style={styles.pokemonTypesContainer}>
        <Text style={[styles.pokemonType, { color: textColor }]}>{capitalizeString(type1)}</Text>
        {type2 && <Text style={[styles.pokemonType, { color: textColor }]}>{capitalizeString(type2)}</Text>}
      </View>
    );

    return (
      <View style={[styles.itemContainer, { backgroundColor } ]}>
        <Link 
          style={styles.itemCard} 
          href={`/pokemon/${pokemon.id}`}
        >
          <View style={styles.itemDetailsContainer}>
            <Text style={[styles.pokemonId, { color: textColor }]}>{pokemon.id}</Text>
            <View style={styles.pokemonNameAndTypeContainer}>
              <View style={styles.nameContainer}>
                <Text style={[styles.pokemonName, { color: textColor } ]}>{capitalizeString(pokemon.name)}</Text>
                <IconContainer pokemon={pokemon} />
              </View>
              {typesContainer}
            </View>
          </View>
          <Image
            style={styles.image}
            source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
            contentFit="contain"
            transition={0}
            recyclingKey={pokemon.name}
          />
        </Link>
      </View>
    );
});

const styles = StyleSheet.create({
  itemContainer: {
    aspectRatio: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  itemDetailsContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
  },
  pokemonId: {
    fontSize: 16,
  },
  pokemonNameAndTypeContainer: {

  },
  nameContainer: {
    flexDirection: 'row',
  },
  pokemonName: {
    fontSize: 20,
    marginBottom: 10,
    paddingRight: 15,
  },
  pokemonTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pokemonType: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#555',
    textAlign: 'center',
  },
  image: {
    width: 75,
    height: 75,
  },
});