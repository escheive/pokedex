import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { capitalizeString } from '../../utils/helpers';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Image } from 'expo-image';

export const OctagonEvolutionLayout = ({ evolutionChain }) => {
  console.log("Evolution chain", evolutionChain)
  const centerPokemon = evolutionChain.find(pokemon => pokemon.name === 'eevee');
  const evolutions = evolutionChain.filter(pokemon => pokemon.name !== 'eevee');


  const topEvolutions = evolutions.slice(0,3)
  const bottomEvolutions = evolutions.slice(3,5).concat(evolutions.slice(7,8))


  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {topEvolutions.map((pokemon, index) => (
          <Link 
            href={`/pokemon/${pokemon.id}`}
            key={index}
          >
            <View style={styles.evolutionContainer}>
              <Image
                style={styles.image}
                source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
                transition={0}
              />
              <Text style={styles.evolutionText}>{capitalizeString(pokemon.name)}</Text>
            </View>
          </Link>
        ))}
      </View>

      <View style={styles.middleRow}>
        <Link 
          href={`/pokemon/${evolutions[5].id}`}
          key={evolutions[5].id}
        >
          <View style={styles.evolutionContainer}>
            <Image
              style={styles.image}
              source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutions[5].id}.png` }}
              transition={0}
            />
            <Text style={styles.evolutionText}>{capitalizeString(evolutions[5].name)}</Text>
          </View>
        </Link>

        <Ionicons name='arrow-back-sharp' size={32} color='gray' style={{ marginRight: -40 }} />

        <View style={styles.centerPokemon}>
          <View style={styles.arrowsContainer}>
            <Ionicons name='arrow-back-sharp' size={32} color='gray' style={{ transform: [{ rotate: '45deg' }] }} />
            <Ionicons name='arrow-up-sharp' size={32} color='gray' />
            <Ionicons name='arrow-forward-sharp' size={32} color='gray' style={{ transform: [{ rotate: '-45deg' }] }} />
          </View>

          <Image
            style={styles.image}
            source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${centerPokemon.id}.png` }}
          />
          <Text>{capitalizeString(centerPokemon.name)}</Text>

          <View style={styles.arrowsContainer}>
            <Ionicons name='arrow-back-sharp' size={32} color='gray' style={{ transform: [{ rotate: '-45deg' }] }} />
            <Ionicons name='arrow-down-sharp' size={32} color='gray' />
            <Ionicons name='arrow-forward-sharp' size={32} color='gray' style={{ transform: [{ rotate: '45deg' }] }} />
          </View>
        </View>

        <Ionicons name='arrow-forward-sharp' size={32} color='gray' style={{ marginLeft: -40 }} />

        <Link 
          href={`/pokemon/${evolutions[6].id}`}
          key={evolutions[6].id}
        >
          <View style={styles.evolutionContainer}>
            <Image
              style={styles.image}
              source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolutions[6].id}.png` }}
              transition={0}
            />
            <Text style={styles.evolutionText}>{capitalizeString(evolutions[6].name)}</Text>
          </View>
        </Link>
      </View>

      <View style={styles.bottomRow}>
        {bottomEvolutions.map((pokemon, index) => (
          <Link 
            href={`/pokemon/${pokemon.id}`}
            key={index}
          >
            <View style={styles.evolutionContainer}>
              <Image
                style={styles.image}
                source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png` }}
                transition={0}
              />
              <Text style={styles.evolutionText}>{capitalizeString(pokemon.name)}</Text>
            </View>
          </Link>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  centerPokemon: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evolutionContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 75,
    height: 75,
  },
  evolutionText: {
    color: '#ccc',
    textAlign: 'center',
  },
  leftArrowContainer: {
    flexDirection: 'column',
    marginRight: -60,
    height: '100%',
  },
  rightArrowContainer: {
    flexDirection: 'column',
    marginLeft: -60,
    height: '100%',
  },
  arrowsContainer: {
    flexDirection: 'row',
    width: '140%',
    justifyContent: 'space-between',
  },
});