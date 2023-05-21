// Dependencies
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
// Components
import PokemonStats from '../components/pokemon/PokemonStats';
import PillBar from '../components/PillBar';
import PokemonCard from '../components/pokemon/PokemonCard';
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

const DetailsScreen = ({ route, navigation }: DetailsScreenProps) => {
    // Grab our pokemon data that was pulled in our app.tsx from params
    const { pokemon } = route.params;
    // useState to update if a pokemon was favorited or unfavorited without refreshing
    const [isFavorite, setIsFavorite] = useState(false);
    // useState to track pokemonAbilities for each individual pokemon when their page is pulled up
    const [pokemonAbilities, setPokemonAbilities] = useState([]);
    // Variable to store pokedex entry after fetching
    const [pokedexEntry, setPokedexEntry] = useState({ "genus": "", "flavorText": ""});
    // useState for the nav below the pokemon card
    const [selectedTab, setSelectedTab] = React.useState('stats');
    // useState for additional pokemon data
    const [additionalData, setAdditionalData] = useState(null);

    // Function to handlePress of the previous evolution button in top left corner
    const handlePress = async (pokemonId) => {

        // If the pokemon data is not cached, fetch it
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
        // parse the returned api response and extract the JSON data
        const pokemon = await pokemonResponse.json();

        // Navigate to the details page with the fetched pokemon data
        navigation.navigate('Info', { pokemon });
    }

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

    // Stylesheet for this screen
    const styles = StyleSheet.create({
        container: {
            height: '100%',
            backgroundColor: pokemonColors[pokemon.type1].backgroundColor
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

        <FlatList style={styles.container}
            data={[pokemon]}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <>
                    <PokemonCard
                        pokemon={pokemon}
                        pokedexEntry={pokedexEntry}
                        pokemonAbilities={pokemonAbilities}
                        handlePress={handlePress}
                        pokemonColors={pokemonColors}
                    />

                    <PokemonStats pokemonColors={pokemonColors} pokemon={pokemon} />


{/*                     <View style={{ marginTop: 20 }}> */}

{/*                             <TouchableOpacity */}
{/*                                 style={styles.favButton} */}
{/*                                 onPress={handleFavoritePress} */}
{/*                             > */}
{/*                                 <Text style={styles.favButtonText}>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</Text> */}
{/*                             </TouchableOpacity> */}
{/*                     </View> */}

                </>
            )}
        />
    );
};

export default DetailsScreen;