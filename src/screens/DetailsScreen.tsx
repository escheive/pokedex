import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import LinearGradient from 'react-native-linear-gradient';

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
                backgroundColor: 'gray',
                color: 'white',
            };
        case 'fire':
            return {
                backgroundColor: 'orange',
                color: 'black',
            };
        case 'water':
            return {
                backgroundColor: 'blue',
                color: 'white',
            };
        case 'grass':
            return {
                backgroundColor: 'green',
                color: 'white',
            };
        case 'electric':
            return {
                backgroundColor: 'yellow',
                color: 'black',
            };
        case 'ice':
            return {
                backgroundColor: 'cyan',
                color: 'black',
            };
        case 'fighting':
            return {
                backgroundColor: 'red',
                color: 'white',
            };
        case 'poison':
            return {
                backgroundColor: 'purple',
                color: 'white',
            };
        case 'ground':
            return {
                backgroundColor: 'brown',
                color: 'white',
            };
        case 'flying':
            return {
                backgroundColor: 'skyblue',
                color: 'black',
            };
        case 'psychic':
            return {
                backgroundColor: 'pink',
                color: 'black',
            };
        case 'bug':
            return {
                backgroundColor: 'lime',
                color: 'black',
            };
        case 'rock':
            return {
                backgroundColor: 'sienna',
                color: 'white',
            };
        case 'ghost':
            return {
                backgroundColor: 'violet',
                color: 'white',
            };
        case 'dragon':
            return {
                backgroundColor: 'indigo',
                color: 'white',
            };
        case 'dark':
            return {
                backgroundColor: 'black',
                color: 'white',
            };
        case 'steel':
            return {
                backgroundColor: 'silver',
                color: 'black',
            };
        case 'fairy':
            return {
                backgroundColor: 'magenta',
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
        marginTop: 16,
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
        marginBottom: 32,
      },
      typesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
      },
      type: {
        padding: 10,
        borderRadius: 16,
        marginHorizontal: 8,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    });

    const stylesArray = getTypeBackgroundStyle(pokemon.types);
    pokemonColors = stylesArray.map((style) => style.backgroundColor);
    const gradientColors = pokemonColors.length < 2 ? [pokemonColors[0], '#FFFFFF'] : pokemonColors;

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
        <Text style={styles.detailsText}>Type:</Text>
        <View style={styles.typesContainer}>
            {pokemon.types.map((type) => (
                <View key={type.type.name} style={[styles.type, ...getTypeBackgroundStyle([type])]}>
                    <Text style={{ color: getTypeStyle(type.type.name).color, fontSize: 16, fontWeight: '600' }}>
                        {type.type.name}
                    </Text>
                </View>
            ))}
        </View>
        <Text>{pokemon.stats.hp}</Text>
    </View>
  );
};

export default DetailsScreen;