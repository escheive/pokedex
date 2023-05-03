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


    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 10,
        borderColor: 'tan',
        borderRadius: 10,
        margin: 10,
        padding: 10,
        backgroundColor: getTypeBackgroundStyle([pokemon.types[0]])[0].backgroundColor,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        fontFamily: 'Arial, sans-serif',
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 24,
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
        marginRight: 24,
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
        marginBottom: 32,
        borderWidth: 3,
        borderColor: 'gray',
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




  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.nameContainer}>
                <Text style={styles.heading}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
                <Text style={styles.hp}>{pokemon.stats[0].base_stat} HP</Text>
            </View>
        </View>
    <Image
        style={[styles.image, getTypeBackgroundStyle([pokemon.types[0]])[0]]}
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` }}
    />
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