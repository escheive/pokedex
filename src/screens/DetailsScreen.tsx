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
            backgroundColor: 'skyBlue',
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
            <Text style={{ color: getTypeStyle(type.type.name).color }}>
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
    padding: 8,
    borderRadius: 16,
    marginHorizontal: 8,
  },
});

export default DetailsScreen;