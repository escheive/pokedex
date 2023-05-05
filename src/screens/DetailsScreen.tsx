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
    // Grab our pokemon data that was pulled in our app.tsx from params
    const { pokemon } = route.params;
    // useState to update if a pokemon was favorited or unfavorited without refreshing
    const [isFavorite, setIsFavorite] = useState(false);
    // useState to track pokemonAbilities for each individual pokemon when their page is pulled up
    const [pokemonAbilities, setPokemonAbilities] = useState([]);
    // Declare an array so that we can assign colors for this pokemon based on its type
    let pokemonColors = [];

    // Function to fetch the ability information as abilities are stored in a separate part of the PokeApi
    const fetchAbility = async (ability: AbilityProps) => {
        // Fetch the url provided for the pokemons ability in the pokemon info
        const abilityDefinitionResponse = await fetch(ability.ability.url);
        // assign the returned json to a variable so that it can be handled
        const abilityDefinition = await abilityDefinitionResponse.json();

        // Because not all abilities are formatted the same, this function will only return the english definition.
        const getEnglishAbilityDescription = () => {
            // Loop through all of the keys in effect_entries
            for (const entry of abilityDefinition.effect_entries) {
                // If the entry language is english, return data
                if (entry.language.name == "en") {
                    return entry.short_effect;
                }
            };
            // If not english definition exists, return undefined
            return undefined;
        };

        // Assign the return of the above function as a variable
        const effect_entries = getEnglishAbilityDescription();
        // assign the ability's name which is part of our original pokemon info, and the newly returned description as an object
        const abilityData = { name: ability.ability.name, definition: effect_entries }
        // Updated our abilities state by combining any previous info stored with our new info
        setPokemonAbilities((prevAbilities) => [...prevAbilities, abilityData]);
    };

    // useEffect to check if a pokemon is favorited and fetch ability info on component mount
    useEffect(() => {
        checkIfFavorite();
        // Function to map through the pokemon abilities and then run fetchAbility function to grab the definitions for each
        const fetchAbilityData = async () => {
            const promises = pokemon.abilities.map((ability) => fetchAbility(ability));
            const result = await Promise.all(promises);
        };
        fetchAbilityData();
    }, []);

    // Function to check if a pokemon is favorited and update the page accordingly
    const checkIfFavorite = async () => {
        // Run imported function from favorites file in utils folder to grab all favorited pokemon for a user and store them in a variable
        const favorites = await getFavorites();
        // If this pokemon is one of the favorites, set as true
        if (favorites.some(pokemonObject => pokemonObject.id === pokemon.id)) {
            setIsFavorite(true);
        }
    };

    // Handle someone pressing the favorite pokemon button
    const handleFavoritePress = async () => {
        // If pokemon is already favorited, run imported function from favorites util to remove it from storage, then update page without needing refresh
        if (isFavorite) {
            await removeFavoritePokemon(pokemon);
            setIsFavorite(false);
        // If pokemon is not favorited, run imported function from utils folder to save it as a favorite, then update state to reflect immediately
        } else {
            const added = await addFavoritePokemon(pokemon);
            setIsFavorite(added);
        }
    };


    // Function to take the pokemons types, run function to get the corresponding color and then create an array of colors based on types
    const getTypeBackgroundStyle = (types: TypeProps[]) => {
      const stylesArray = types.map((type) => getTypeStyle(type.type.name));
      pokemonColors.push(stylesArray[0].backgroundColor)
      return stylesArray.filter(style => Object.keys(style).length > 0);
    };

    // Variables to track the pokemons colors
    const stylesArray = getTypeBackgroundStyle(pokemon.types);
    pokemonColors = stylesArray.map((style) => style.backgroundColor);
    const gradientColors = pokemonColors.length < 2 ? [pokemonColors[0], '#FFFFFF'] : pokemonColors;

    // Stylesheet for this screen
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