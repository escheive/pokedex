
// Dependencies
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, TouchableOpacity, Dimensions, Animated, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Components
import PokemonImage from '../components/pokemon/PokemonImage';
import LevelUpMovesScreen from '../components/moves/LevelUpMovesScreen';
import EggMovesScreen from '../components/moves/EggMovesScreen';
import TMMovesScreen from '../components/moves/TMMovesScreen';
import TutorMovesScreen from '../components/moves/TutorMovesScreen';
import Moves from '../components/moves/Moves';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Utils
import { pokemonColors } from '../utils/typeStyle';


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

const damageClasses = {
    "physical":
        {
            "background": '#C92112',
            "font": '#FFA648'
        },
    "special":
        {
            "background": '#4F5870',
            "font": 'white'
        },
    "status":
        {
            "background": '#8C888C',
            "font": 'white'
        }
}

const MovesScreen = ({ route, navigation }: DetailsScreenProps) => {
    // Grab our pokemon data that was pulled in our app.tsx from params
    const { pokemon } = route.params;
    const parsedMoves = JSON.parse(pokemon.moves);
    const [movesData, setMovesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect to fetch pokemon moves data on component mount
    useEffect(() => {
        const fetchMovesData = async () => {
            try {
                const moves = parsedMoves.map(async (move) => {
                    const response = await fetch(`https://pokeapi.co/api/v2/move/${move.name}/`);
                    try {
                        const data = await response.json();
                        const { name, power, accuracy, pp, type, contest_type, damage_class } = data;
                        return { name, power, accuracy, pp, type, contest_type, damage_class };
                    } catch (error) {
                        console.error('Error parsing JSON:', error)
                    }
                });
                const movesData = await Promise.all(moves);
                setMovesData(movesData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching moves data on the MovesScreen:', error)
                setIsLoading(false);
            }
        }

        fetchMovesData();
    }, []);


    // Stylesheet for this screen
    const styles = StyleSheet.create({
        container: {
            height: '100%',
            backgroundColor: 'white',
        },
        movesContainer: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: pokemonColors[pokemon.type1].backgroundColor,
        },
        tabLabel: {
            fontSize: 16,
        },
        tabIndicator: {
            backgroundColor: pokemonColors[pokemon.type1].backgroundColor,
        },
    });

    return (

        <View style={styles.container}>
            <PokemonImage
                pokemon={pokemon}
            />

            <View style={styles.movesContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : (
                    <Tab.Navigator
                        screenOptions={{
                            tabBarIndicatorStyle: styles.tabIndicator,
                            tabBarLabelStyle: styles.tabLabel,
                            tabBarActiveTintColor: pokemonColors[pokemon.type1].backgroundColor,
                            tabBarInactiveTintColor: 'gray',
                            lazy: true,
                        }}
                        tabBarPosition="top"
                        initialRouteName="Level Up"
                    >
                        <Tab.Screen name="Level Up">
                            {() => <Moves parsedMoves={parsedMoves} movesData={movesData} damageClasses={damageClasses} typeOfMove={'level-up'} />}
                        </Tab.Screen>
                        <Tab.Screen name="TM">
                            {() => <Moves parsedMoves={parsedMoves} movesData={movesData} damageClasses={damageClasses} typeOfMove={'machine'} />}
                        </Tab.Screen>
                        <Tab.Screen name="Egg">
                            {() => <Moves parsedMoves={parsedMoves} movesData={movesData} damageClasses={damageClasses} typeOfMove={'egg'} />}
                        </Tab.Screen>
                        <Tab.Screen name="Tutor">
                            {() => <Moves parsedMoves={parsedMoves} movesData={movesData} damageClasses={damageClasses} typeOfMove={'tutor'} />}
                        </Tab.Screen>
                    </Tab.Navigator>
                )}
            </View>

        </View>
    );
};

export default MovesScreen;