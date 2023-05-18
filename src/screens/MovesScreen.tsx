
// Dependencies
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity, Dimensions, Animated, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Components
import PokemonImage from '../components/pokemon/PokemonImage';
import LevelUpMovesScreen from '../components/moves/LevelUpMovesScreen';
import EggMovesScreen from '../components/moves/EggMovesScreen';
import TMMovesScreen from '../components/moves/TMMovesScreen';
import TutorMovesScreen from '../components/moves/TutorMovesScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
// Utils


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
    const [movesData, setMovesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Function to handlePress of the previous evolution button in top left corner
    const handlePress = async (pokemonId) => {

        // If the pokemon data is not cached, fetch it
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
        // parse the returned api response and extract the JSON data
        const pokemon = await pokemonResponse.json();

        // Navigate to the details page with the fetched pokemon data
        navigation.navigate('Details', { pokemon });
    }


    // useEffect to fetch pokemon moves data on component mount
    useEffect(() => {
        const fetchMovesData = async () => {
            try {
                const moves = pokemon.moves.map(async (move) => {
                    const response = await fetch(`https://pokeapi.co/api/v2/move/${move.move.name}/`);
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
        Container: {
            height: '100%',
        },
        movesContainer: {
            flex: 1,
            justifyContent: 'center',
            marginBottom: 15,
        },
        tabLabel: {
            fontSize: 16,
        },
        tabIndicator: {
            backgroundColor: 'black',
        },
    });

    return (

        <View style={styles.Container}>
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
                            tabBarActiveTintColor: 'black',
                            tabBarInactiveTintColor: 'gray',
                        }}
                        tabBarPosition="top"
                        initialRouteName="Level Up"
                    >
                        <Tab.Screen name="Level Up">
                            {() => <LevelUpMovesScreen pokemon={pokemon} movesData={movesData} />}
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
                )}
            </View>

        </View>
    );
};

export default MovesScreen;