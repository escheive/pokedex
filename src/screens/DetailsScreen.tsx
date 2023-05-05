import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import LinearGradient from 'react-native-linear-gradient';
import PokemonStats from '../components/PokemonStats';
// Import the heart icon from the react-icons library
import { FaHeart } from 'react-icons/fa';
import { getFavorites, addFavoritePokemon, removeFavoritePokemon } from '../utils/favorites.tsx';
import { getTypeStyle } from '../utils/typeStyle';
import { PokemonAbilities } from '../components/PokemonAbilities';

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [pokemonAbilities, setPokemonAbilities] = useState([]);

  let pokemonColors = [];

//   if (pokemon.abilities) {
//     pokemon.abilities.map(async (ability, index) => {
//         let abilityDefinitionResponse = await fetch(ability.ability.url)
//         let abilityDefinition = await abilityDefinitionResponse.json();
//         pokemonAbilities.push({ name: ability.ability.name, definition: abilityDefinition.effect_entries[1].effect })
//         console.log(pokemonAbilities)
//     });
//   }

  const fetchAbility = async (ability: AbilityProps) => {
      const abilityDefinitionResponse = await fetch(ability.ability.url);
      const abilityDefinition = await abilityDefinitionResponse.json();
      const abilityData = await { name: ability.ability.name, definition: abilityDefinition.effect_entries[1].effect }
      setPokemonAbilities((prevAbilities) => [...prevAbilities, abilityData]);
    };

  useEffect(() => {
      checkIfFavorite();
      const fetchAbilityData = async () => {
        const promises = pokemon.abilities.map((ability) => fetchAbility(ability));
        const result = await Promise.all(promises);
      };
      fetchAbilityData();
    }, []);

    const checkIfFavorite = async () => {
        const favorites = await getFavorites();
        if (favorites.some(pokemonObject => pokemonObject.id === pokemon.id)) {
            setIsFavorite(true);
        }
    };

  const handleFavoritePress = async () => {
      if (isFavorite) {
        await removeFavoritePokemon(pokemon);
        setIsFavorite(false);
      } else {
        const added = await addFavoritePokemon(pokemon);
        setIsFavorite(added);
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
        height: '100%',
      },
      card: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 10,
        borderColor: '#e3cc0c',
        borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
        marginBottom: 20,
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
        marginBottom: 8,
      },
      type: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginHorizontal: 8,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    });

    console.log(pokemonAbilities)

  return (
    <FlatList style={styles.container}
        data={[pokemon]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <>
                <View style={styles.card}>
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
                <View>
                  <Button title={isFavorite ? 'Remove from favorites' : 'Add to favorites'} onPress={handleFavoritePress} />
                </View>
                <View>
                    {pokemonAbilities !== null && (
                        pokemonAbilities.map((ability) => (
                            <View key={ability.name}>
                                <Text>{ability.name}</Text>
                                <Text>{ability.definition}</Text>
                            </View>
                        ))
                    )}
                </View>
            </>
        )}
    />
  );
};

export default DetailsScreen;