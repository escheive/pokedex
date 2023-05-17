
// Dependencies
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
// Components
import PokemonStats from '../components/pokemon/PokemonStats';
import PillBar from '../components/PillBar';
import PokemonCard from '../components/pokemon/PokemonCard';
import PokemonImage from '../components/pokemon/PokemonImage';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Utils
import { getFavorites, addFavoritePokemon, removeFavoritePokemon } from '../utils/favorites.tsx';
import { getTypeStyle } from '../utils/typeStyle';
import { fetchAbility, fetchAbilityData, getPokedexEntry, fetchAdditionalData } from '../utils/pokemonDetails';

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

const MovesScreen = ({ route, navigation }: DetailsScreenProps) => {
    // Grab our pokemon data that was pulled in our app.tsx from params
    const { pokemon } = route.params;
    // useState to update if a pokemon was favorited or unfavorited without refreshing
    const [isFavorite, setIsFavorite] = useState(false);
    // useState to track pokemonAbilities for each individual pokemon when their page is pulled up
    const [pokemonAbilities, setPokemonAbilities] = useState([]);
    // Declare an array so that we can assign colors for this pokemon based on its type
    let pokemonColors = [];
    // Variable to store pokedex entry after fetching
    const [pokedexEntry, setPokedexEntry] = useState({ "genus": "", "flavorText": ""});
    // useState for the nav below the pokemon card
    const [selectedTab, setSelectedTab] = React.useState('stats');
    // useState for displaying pokemon moves
    const [displayedMovesCount, setDisplayedMovesCount] = useState(20); // Set an initial count, such as 10
    // useState for tracking previous evolution
    const [prevEvolution, setPrevEvolution] = useState(`${pokemon.id - 1}`)
    // useState for additional pokemon data
    const [additionalData, setAdditionalData] = useState(null);


    grabPokemonColors = async () => {
        for(const type of pokemon.types) {
            pokemonColors.push((getTypeStyle(type.type.name)))
        }
    }
    grabPokemonColors();

    // Function to handlePress of the previous evolution button in top left corner
    const handlePress = async (pokemonId) => {

        // If the pokemon data is not cached, fetch it
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
        // parse the returned api response and extract the JSON data
        const pokemon = await pokemonResponse.json();

        // Navigate to the details page with the fetched pokemon data
        navigation.navigate('Details', { pokemon });
    }

    const handlePrevEvolution = async (pokemonId) => {
      // Fetch info for the pokemon species
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
      const species = await speciesResponse.json();

      // Check if the species has evolution chain information
      if (species.evolution_chain && species.evolution_chain.url) {
        // Fetch the evolution chain data
        const evolutionChainResponse = await fetch(species.evolution_chain.url);
        const evolutionChain = await evolutionChainResponse.json();

        // Find the previous evolution based on the current pokemonId
        const prevEvolution = findPreviousEvolution(evolutionChain, pokemonId);

        if (prevEvolution) {
          handlePress(prevEvolution)
        }
      }
    };

    const findPreviousEvolution = (evolutionChain, pokemonId) => {
        if (evolutionChain.chain.species && evolutionChain.chain.species.url) {
            const urlParts = evolutionChain.chain.species.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 2]);
            console.log(evolutionChain.chain.evolves_to[0].species.name)
            if (id === pokemonId) {
                // If the current Pokemon is the base species, return null
                return null;
            } else if (id === pokemonId - 1) {
                return evolutionChain.chain.species.name;
            } else if (id === pokemonId - 2) {
                return evolutionChain.chain.evolves_to[0].species.name;
            } else if (evolutionChain.chain.evolves_to.length > 0) {
                // If the current Pokemon is not the base species, find its previous evolution
                for (const evolution of evolutionChain.chain.evolves_to) {
                    if (evolution.species && evolution.species.url) {
                        const urlParts = evolution.species.url.split('/');
                        const id = parseInt(urlParts[urlParts.length - 2]);


                        if (id === pokemonId) {
                            // Found the previous evolution, return its id
                            return evolutionChain.chain.species.name;
                        } else if (evolutionChain.chain.evolves_to[0].evolves_to.length > 0) {
                            console.log('here')
                            for (const evolution of evolutionChain.chain.evolves_to[0].evolves_to) {
                                if (evolution.species && evolution.species.url) {
                                    const urlParts = evolution.species.url.split('/');
                                    const id = parseInt(urlParts[urlParts.length - 2]);

                                    if (id === pokemonId) {
                                        return evolutionChain.chain.evolves_to[0].species.name;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Previous evolution not found
        return null;
    };


    // useEffect to check if a pokemon is favorited and fetch ability info when pokemon object changes
    useEffect(() => {
        getPokedexEntry(setPokedexEntry, pokemon.species)

        checkIfFavorite();

        fetchAbilityData(pokemonAbilities, pokemon.abilities, setPokemonAbilities);

        const fetchDetails = async () => {
            const data = await fetchAdditionalData(pokemon.id, pokemon.abilities); // Fetch additional data using this pokemons id
            setAdditionalData(data);
        }
        fetchDetails();
    }, [pokemon.id]);

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
//     const getTypeBackgroundStyle = (types: TypeProps[]) => {
//         const stylesArray = types.map((type) => getTypeStyle(type.type.name));
//         pokemonColors.push(stylesArray[0].backgroundColor)
//         return stylesArray.filter(style => Object.keys(style).length > 0);
//     };

    // Function to take the pokemons types, and grab the info for that type
    const getTypeInfo = async (typesArr: TypeProps[]) => {
        const typePromises = typesArr.map(async (type) => {
            const response = await fetch(type.type.url);
            let typeInfo = await response.json();
            typeInfo = typeInfo.damage_relations;
            const strengthsAndWeaknesses = {
                strengths: typeInfo.double_damage_to,
                weaknesses: typeInfo.double_damage_from,
                noDamageFrom: typeInfo.no_damage_from,
                noDamageTo: typeInfo.no_damage_to
            }
            return strengthsAndWeaknesses;
        });
        const damageRelations = await Promise.all(typePromises);
        return damageRelations;
    };

    const getTypeInfoAndCalculateDamage = async (typesArr: TypeProps[]) => {
        const damageRelations = await getTypeInfo(typesArr);
        let strengths = [];
        let weaknesses = [];
        let noDamageTo = [];
        let noDamageFrom = [];

        for (const type of damageRelations) {
//             console.log(type.strengths.map((strength) => strength.name))
            typeStrengths = type.strengths ? await type.strengths.map((strength) => strengths.push(strength.name)) : [];
//             strengths.push(typeStrengths)
//             console.log(strengths)
            weaknesses = type.weaknesses ? await type.weaknesses.map((weakness) => weakness.name) : [];
            noDamageFrom = type.no_damage_from ? await type.no_damage_from.map((noDamageFrom) => noDamageFrom.name) : [];
            noDamageTo = type.no_damage_to ? await type.no_damage_to.map((noDamageTo) => noDamageTo.name) : [];
        }

        return {
            strengths,
            weaknesses,
            noDamageFrom,
            noDamageTo
        };
    };

    async function getPokemonTypeInfo(pokemon) {
        try {
            const typeInfo = await getTypeInfoAndCalculateDamage(pokemon.types);
            return typeInfo;
        } catch (error) {
            console.log(error);
        }
    }

    getPokemonTypeInfo(pokemon).then((typeInfo) => {
//         console.log(typeInfo)
    });

    // Variables to track the pokemons colors
//     const stylesArray = getTypeBackgroundStyle(pokemon.types);
//     pokemonColors = stylesArray.map((style) => style.backgroundColor);
//     const gradientColors = pokemonColors.length < 2 ? [pokemonColors[0], '#FFFFFF'] : pokemonColors;

    // Stylesheet for this screen
    const styles = StyleSheet.create({
        container: {
            height: '100%',
        },
        navContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
            marginBottom: 25,
        },
        navItem: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            borderRadius: 5,
            marginHorizontal: 5,
        },
        navItemText: {
            color: 'white',
            fontSize: 20,
        },
        selectedNavItemText: {
            fontWeight: 'bold',
        },
        tabContent: {
            marginHorizontal: 20,
        },
        pokedexEntryContainer: {
            flexDirection: 'row',
            paddingHorizontal: 10,
        },
        column: {
            flex: 1,
        },
        entryTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        entryInfo: {
            fontSize: 20,
            marginBottom: 10,
            paddingVertical: 1,
            alignSelf: 'flex-end',
        },
        favButton: {
            backgroundColor: pokemonColors[0],
            padding: 10,
            alignItems: 'center',
            marginBottom: 20,
        },
        favButtonText: {
            fontSize: 20,
        },
        abilityContainer: {
            marginLeft: 10,
        },
        abilitiesTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 15,
        },
        ability: {
            marginBottom: 10,
            paddingLeft: 15,
        },
        abilityName: {
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 5,
        },
        abilityDefinition: {
            fontSize: 18,
            lineHeight: 20,
        },
        movesContainer: {
            flex: 1,
            justifyContent: 'center',
            marginBottom: 15,
        },
        columnWrapper: {
            justifyContent: 'space-between',
        },
        individualMoveContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
        },
        moves: {
            textAlign: 'center',
            fontSize: 20,
        },
        loadMoreMoves: {
            fontSize: 26,
            color: pokemonColors[0],
            textAlign: 'center',
        },
    });

    return (

        <FlatList style={styles.container}
            data={[pokemon]}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <>
                    <PokemonImage
                        pokemon={pokemon}
                    />


                    <View style={styles.movesContainer}>
                        <FlatList
                            data={pokemon.moves.slice(0, displayedMovesCount)}
                            keyExtractor={(move) => move.move.name}
                            numColumns={2}
                            columnWrapperStyle={styles.columnWrapper}
                            renderItem={({ item }) => (
                                <View style={styles.individualMoveContainer}>
                                    <Text style={styles.moves} key={item.move.name}>{item.move.name.charAt(0).toUpperCase() + item.move.name.slice(1)}</Text>
                                </View>
                            )}
                        />
                    </View>

                    {displayedMovesCount < pokemon.moves.length && (
                        <TouchableOpacity
                            onPress={() => setDisplayedMovesCount(displayedMovesCount + 20)}
                        >
                            <Text style={styles.loadMoreMoves}>More moves</Text>
                        </TouchableOpacity>
                    )}


                    <View style={{ marginTop: 20 }}>

                            <TouchableOpacity
                                style={styles.favButton}
                                onPress={handleFavoritePress}
                            >
                                <Text style={styles.favButtonText}>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</Text>
                            </TouchableOpacity>
                    </View>

                </>
            )}
        />
    );
};

export default MovesScreen;