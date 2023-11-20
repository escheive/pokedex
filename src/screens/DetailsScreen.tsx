// Dependencies
import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
// Components
import PokemonStats from '../components/pokemon/PokemonStats';
import PillBar from '../components/PillBar';
import PokemonCard from '../components/pokemon/PokemonCard';
import EvolutionChain from '../components/pokemon/EvolutionChain';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Utils
import { getFavorites, addFavoritePokemon, removeFavoritePokemon } from '../utils/favorites.tsx';
import { getTypeStyle, pokemonColors } from '../utils/typeStyle';
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

const DetailsScreen = ({ route, navigation, allPokemonAbilities }: DetailsScreenProps) => {
    // Grab our pokemon data that was pulled in our app.tsx from params
    const { pokemon } = route.params;
//     const abilitiesData = useSelector((state) => state.abilities.abilitiesData);
    // useState to update if a pokemon was favorited or unfavorited without refreshing
    const [isFavorite, setIsFavorite] = useState(false);
    // useState to track pokemonAbilities for each individual pokemon when their page is pulled up
    const [thisPokemonsAbilities, setThisPokemonsAbilities] = useState([]);
    // Variable to store pokedex entry after fetching
    const [pokedexEntry, setPokedexEntry] = useState({ "genus": "", "flavorText": ""});
    // useState for the nav below the pokemon card
    const [selectedTab, setSelectedTab] = React.useState('stats');
    // useState for additional pokemon data
    const [additionalData, setAdditionalData] = useState(null);
    const scrollViewRef = useRef();

    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    };

    // useEffect to check if a pokemon is favorited and fetch ability info when pokemon object changes
    useEffect(() => {
//         getPokedexEntry(setPokedexEntry, pokemon.species_url)

        checkIfFavorite();

        const findThisPokemonsAbilities = async () => {
            const pokeAbilities = await abilitiesData.filter((ability) => {
                const pokemonWithAbility = JSON.parse(ability.pokemonWithAbility);
                return pokemonWithAbility.includes(pokemon.name)
            })
            setThisPokemonsAbilities(pokeAbilities)
        }
        findThisPokemonsAbilities()

//         fetchAbilityData(pokemonAbilities, pokemon.abilities, setPokemonAbilities);

//         const fetchDetails = async () => {
//             const data = await fetchAdditionalData(pokemon); // Fetch additional data using this pokemons id
//             setAdditionalData(data);
//         }
//         fetchDetails();
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

    // Stylesheet for this screen
    const styles = StyleSheet.create({
        container: {
            height: '100%',
            backgroundColor: 'white',
//             backgroundColor: pokemonColors[pokemon.type1].backgroundColor,
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
            marginHorizontal: 10,
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
            backgroundColor: pokemonColors[pokemon.type1].backgroundColor,
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
            color: pokemonColors[pokemon.type1].color,
            textAlign: 'center',
        },
    });

    return (
        <ScrollView style={styles.container} ref={scrollViewRef}>
            <PokemonCard
                pokemon={pokemon}
                pokedexEntry={pokedexEntry}
                thisPokemonsAbilities={thisPokemonsAbilities}
                pokemonColors={pokemonColors}
            />

            <PokemonStats pokemonColors={pokemonColors} pokemon={pokemon} />

            <EvolutionChain pokemon={pokemon} pokemonColors={pokemonColors} navigation={navigation} scrollToTop={scrollToTop} />
        </ScrollView>
    );
};

export default DetailsScreen;