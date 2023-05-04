import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, FlatList } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import LinearGradient from 'react-native-linear-gradient';
import PokemonStats from '../components/PokemonStats';

type TypeProps = {
    type: {
        name: string;
    };
};

type PokemonProps = {
  name: string;
  id: number;
  types: TypeProps[];
}

type DetailsScreenProps = {
  route: {
    params: {
      pokemon: PokemonProps;
    };
  };
  navigation: any;
}


const DetailsScreen = ({ route, navigation }: DetailsScreenProps) => {
  const { pokemon } = route.params;
  let pokemonColors = [];

  // Define a function to return styles for each type
    const getTypeStyle = (typeName: string) => {
      switch (typeName) {
        case 'normal':
            return {
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                color: 'white',
            };
        case 'fire':
            return {
                backgroundColor: 'rgba(255, 165, 0, 0.5)',
                color: 'black',
            };
        case 'water':
            return {
                backgroundColor: 'rgba(30, 144, 255, 0.5)',
                color: 'white',
            };
        case 'grass':
            return {
                backgroundColor: 'rgba(0, 128, 0, 0.5)',
                color: 'white',
            };
        case 'electric':
            return {
                backgroundColor: 'rgba(255, 255, 0, 0.5)',
                color: 'black',
            };
        case 'ice':
            return {
                backgroundColor: 'rgba(0, 255, 255, 0.5)',
                color: 'black',
            };
        case 'fighting':
            return {
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                color: 'white',
            };
        case 'poison':
            return {
                backgroundColor: 'rgba(128, 0, 128, 0.5)',
                color: 'white',
            };
        case 'ground':
            return {
                backgroundColor: 'rgba(165, 42, 42, 0.5)',
                color: 'white',
            };
        case 'flying':
            return {
                backgroundColor: 'rgba(135, 206, 235, 0.5)',
                color: 'black',
            };
        case 'psychic':
            return {
                backgroundColor: 'rgba(255, 192, 203, 0.5)',
                color: 'black',
            };
        case 'bug':
            return {
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
                color: 'black',
            };
        case 'rock':
            return {
                backgroundColor: 'rgba(160, 82, 45, 0.5)',
                color: 'white',
            };
        case 'ghost':
            return {
                backgroundColor: 'rgba(238, 130, 238, 0.5)',
                color: 'white',
            };
        case 'dragon':
            return {
                backgroundColor: 'rgba(75, 0, 130, 0.5)',
                color: 'white',
            };
        case 'dark':
            return {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
            };
        case 'steel':
            return {
                backgroundColor: 'rgba(192, 192, 192, 0.5)',
                color: 'black',
            };
        case 'fairy':
            return {
                backgroundColor: 'rgba(255, 0, 255, 0.5)',
                color: 'white',
            };
        default:
          return {};
      }
    };

    const getTypeBackgroundStyle = (types: TypeProps[]) => {
      const stylesArray = types.map((type) => getTypeStyle(type.type.name));
      pokemonColors.push(stylesArray[0].backgroundColor)
      return stylesArray.filter(style => Object.keys(style).length > 0);
    };

    const stylesArray = getTypeBackgroundStyle(pokemon.types);
    pokemonColors = stylesArray.map((style) => style.backgroundColor);
    const gradientColors = pokemonColors.length < 2 ? [pokemonColors[0], '#FFFFFF'] : pokemonColors;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 10,
        borderColor: '#e3cc0c',
        borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
        padding: 10,
        backgroundColor: pokemonColors[0],
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        fontFamily: 'Arial, sans-serif',
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'flex-start'
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        marginHorizontal: 16,
      },
      hp: {
        fontSize: 22,
        fontWeight: '600',
      },
      detailsText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 4,
      },
      image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
      },
      imageContainer: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
        borderWidth: 10,
        borderColor: '#dcb922',
        marginBottom: 16,
      },
      typesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
      },
      type: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginHorizontal: 8,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
      statsContainer: {

      },
    });

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.nameContainer}>
                <Text style={styles.heading}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
                <Text style={styles.hp}>{pokemon.stats[0].base_stat} HP</Text>
            </View>
        </View>
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0}}
            end={{ x: 1, y: 1}}
            style={styles.imageContainer}
        >
            <Image
                style={[styles.image, pokemonColors[0]]}
                source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` }}
            />
        </LinearGradient>
        <View style={styles.typesContainer}>
            {pokemon.types.map((type) => (
                <View key={type.type.name} style={[styles.type, ...getTypeBackgroundStyle([type])]}>
                    <Text style={{ color: getTypeStyle(type.type.name).color, fontSize: 16, fontWeight: '600' }}>
                        {type.type.name}
                    </Text>
                </View>
            ))}
        </View>
        <PokemonStats stats={pokemon.stats} />
    </View>
  );
};

export default DetailsScreen;