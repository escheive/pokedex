
// Dependencies
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Components
import PokemonStats from '../components/pokemon/PokemonStats';
import PillBar from '../components/PillBar';
import PokemonCard from '../components/pokemon/PokemonCard';
import PokemonImage from '../components/pokemon/PokemonImage';
import LevelUpMovesScreen from '../components/moves/LevelUpMovesScreen';
import EggMovesScreen from '../components/moves/EggMovesScreen';
import TMMovesScreen from '../components/moves/TMMovesScreen';
import TutorMovesScreen from '../components/moves/TutorMovesScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Utils
import { getFavorites, addFavoritePokemon, removeFavoritePokemon } from '../utils/favorites.tsx';
import { getTypeStyle } from '../utils/typeStyle';
import { fetchAbility, fetchAbilityData, getPokedexEntry, fetchAdditionalData } from '../utils/pokemonDetails';


const Tab = createMaterialTopTabNavigator();


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
    const [selectedTab, setSelectedTab] = React.useState('level');
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


    // useEffect to check if a pokemon is favorited and fetch ability info when pokemon object changes
    useEffect(() => {

    }, []);


    // Stylesheet for this screen
    const styles = StyleSheet.create({
        Container: {
            height: '100%',
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
    });

    return (

        <View style={styles.Container}>
            <PokemonImage
                pokemon={pokemon}
            />

            <View style={styles.movesContainer}>
                <Tab.Navigator>
                    <Tab.Screen name="Level Up">
                        {() => <LevelUpMovesScreen pokemon={pokemon} />}
                    </Tab.Screen>
                    <Tab.Screen name="TM">
                        {() => <TMMovesScreen pokemon={pokemon} />}
                    </Tab.Screen>
                    <Tab.Screen name="Egg">
                        {() => <EggMovesScreen pokemon={pokemon} />}
                    </Tab.Screen>
                    <Tab.Screen name="Tutor">
                        {() => <TutorMovesScreen pokemon={pokemon} />}
                    </Tab.Screen>
                </Tab.Navigator>
            </View>

        </View>
    );
};

export default MovesScreen;