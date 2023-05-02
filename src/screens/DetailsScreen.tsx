import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

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

  // Define a function to return styles for each type
    const getTypeStyle = (typeName: string) => {
      switch (typeName) {
        case 'normal':
          return {
            backgroundColor: 'gray',
          };
        case 'fire':
          return {
            backgroundColor: 'orange',
          };
        case 'water':
          return {
            backgroundColor: 'blue',
          };
        case 'grass':
          return {
            backgroundColor: '#78c850',
          };
        case 'electric':
          return {
            backgroundColor: 'yellow',
          };
        case 'ice':
          return {
            backgroundColor: 'cyan',
          };
        case 'fighting':
          return {
            backgroundColor: 'red',
          };
        case 'poison':
          return {
            backgroundColor: 'purple',
          };
        case 'ground':
          return {
            backgroundColor: 'brown',
          };
        case 'flying':
          return {
            backgroundColor: 'sky-blue',
          };
        case 'psychic':
          return {
            backgroundColor: 'pink',
          };
        case 'bug':
          return {
            backgroundColor: 'lime',
          };
        case 'rock':
          return {
            backgroundColor: 'sienna',
          };
        case 'ghost':
          return {
            backgroundColor: 'violet',
          };
        case 'dragon':
          return {
            backgroundColor: 'indigo',
          };
        case 'dark':
          return {
            backgroundColor: 'black',
          };
        case 'steel':
          return {
            backgroundColor: 'silver',
          };
        case 'fairy':
          return {
            backgroundColor: 'magenta',
          };
        default:
          return {};
      }
    };

    const getTypeBackgroundStyle = (types: TypeProps[]) => {
      const stylesArray = types.map((type) => getTypeStyle(type.type.name));
      return stylesArray.filter(style => Object.keys(style).length > 0);
    };




  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{pokemon.name}</Text>
      <Image
        style={styles.image}
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` }}
      />
      <Text style={styles.detailsText}>Type:</Text>
      <View style={styles.typesContainer}>
        {pokemon.types.map((type) => (
          <View key={type.type.name} style={[styles.type, ...getTypeBackgroundStyle([type])]}>
            <Text style={styles.typeText}>
              {type.type.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  type: {
    color: 'white',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});

export default DetailsScreen;