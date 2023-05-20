// Reanimated Dependencies
import 'react-native-gesture-handler';
// Dependencies
import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Pokemon } from './types';
// Screens
import PokemonScreen from './src/screens/PokemonScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import MovesScreen from './src/screens/MovesScreen';
// Components
import LoadingScreen from './src/components/LoadingScreen';
// Utils
import { getTypeStyle } from './src/utils/typeStyle';
// Database
import SQLite from 'react-native-sqlite-storage';
// Assets
import typeData from './src/assets/typeData';
import Ionicons from 'react-native-vector-icons/Ionicons';


// Open the database
const database = SQLite.openDatabase({
    name: 'Pokemon.db',
    location: 'default',
});

// Execute SQL statement to create a pokemon table
database.transaction((tx) => {
    tx.executeSql(
        `CREATE TABLE IF NOT EXISTS pokemon (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        type1 TEXT NOT NULL,
        type2 TEXT,
        height REAL,
        weight REAL,
        base_experience INTEGER,
        ability1 TEXT,
        ability2 TEXT,
        ability3 TEXT,
        capture_rate INTEGER,
        evolution_chain_id INTEGER,
        image_url TEXT
        );`,
        [],
        () => {
            console.log('Table "pokemon" created successfully');
        },
        (error) => {
            console.error('Error creating table "pokemon":', error);
        }
    );
});

// Function to insert a Pokemon record into the pokemon table
const insertPokemon = (pokemonData) => {
    database.transaction((tx) => {
        tx.executeSql(
            `INSERT INTO pokemon (id, name, type1, type2, height, weight, base_experience, ability1, ability2, ability3, capture_rate, evolution_chain_id, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                pokemonData.id,
                pokemonData.name,
                pokemonData.type1,
                pokemonData.type2,
                pokemonData.height,
                pokemonData.weight,
                pokemonData.base_experience,
                pokemonData.ability1,
                pokemonData.ability2,
                pokemonData.ability3,
                pokemonData.capture_rate,
                pokemonData.evolution_chain_id,
                pokemonData.image_url,
            ],
            () => {
                console.log('Pokemon record inserted successfully');
            },
            (error) => {
                console.error('Error inserting Pokemon record:', error);
            }
        );
    });
};



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


const BackButton = ({ navigation }) => {
    const handleGoToMainPokemonScreen = () => {
        navigation.goBack();
    };

    return (
        <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={handleGoToMainPokemonScreen}
        />
    );
};


const DrawerNavigator = () => {
    const { Navigator, Screen } = createDrawerNavigator();
    const navigation = useNavigation();

    const route = useRoute();

    const getHeaderTitle = (route: Route<string, object | undefined>) => {
        const routeName = route.name;
        switch (routeName) {
            case 'Pokemon':
                return 'Pokedex';
            case 'Profile':
                return 'Profile';
            case 'Settings':
                return 'Settings';
            default:
                return '';
        }
    };

    const handleNavigationStateChange = (route: Route<string, object | undefined>) => {
        const title = getHeaderTitle(route);
        navigation.setOptions({ headerTitle: title });
    };


    return (
        <Navigator
            screenOptions={{ headerShown: true }}
            drawerContent={(props) => <DrawerContent {...props} />}
            onNavigationStateChange={handleNavigationStateChange}
        >

            <Screen
                name="Pokemon"
                component={PokemonStackNavigator}
            />
            <Screen
                name="Profile"
                component={ProfileScreen}
            />
            <Screen
                name="Settings"
                component={SettingsScreen}
            />

        </Navigator>
    );
};


const DetailsTabNavigator = ({ pokemonList, typeData, route, navigation }) => {
    const { Navigator, Screen } = createBottomTabNavigator();


    return (
        <Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                headerTitle: '',
//                 headerLeft: () => (
//                   <Ionicons
//                     name="arrow-back"
//                     size={24}
//                     color="black"
//                     onPress={() => navigation.goBack()}
//                     style={{ marginLeft: 10 }}
//                   />
//                 ),
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Info') {
                        iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
                    } else if (route.name === 'Moves') {
                        iconName = focused ? 'shield' : 'shield-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Screen
                name='Info'
                component={DetailsScreen}
                initialParams={{ pokemon: route.params.pokemon }}
                options={{
                    title: 'Details',
                }}
            />
            <Screen
                name="Moves"
                component={MovesScreen}
                initialParams={{ pokemon: route.params.pokemon }}
                options={{
                    title: 'Moves'
                }}
            />

        </Navigator>
    );
};


const PokemonStackNavigator = ({ pokemonList, typeData }) => {

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Main">
                {props => <PokemonScreen {...props} pokemonList={pokemonList} typeData={typeData} />}
            </Stack.Screen>

            <Stack.Screen
                name="Details"
                component={DetailsTabNavigator}
                options={({ route }) => {
                    const pokemonType = route.params.pokemon.types[0].type.name;
                    const backgroundColor = getTypeStyle(pokemonType);
                    let pokemonName = route.params.pokemon.name;
                    pokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)

                    return {
                        title: pokemonName,
                    };
                }}
            />
        </Stack.Navigator>
    );
};


function ProfileStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen name="User" component={ProfileScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
};



function SettingsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Options" component={SettingsScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
};



export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

    useEffect(() => {
        // Function to fetch base pokemon data from the api
        const fetchPokemonData = async (start, end) => {
            try {
                // Grab pokemon data using start and end variables to determine which ones are being fetched
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${end - start}&offset=${start}`);
                // parse the data
                const data = await response.json();

                const pokemonUrls = data.results.map((pokemon) => pokemon.url);
                const pokemonData = await Promise.all(pokemonUrls.map((url) => fetch(url).then((response) => response.json())));
                setPokemonList((prevList) => [...prevList, ...pokemonData]);
                setIsLoading(false);

                // Fetch the remaining pokemon in the background
                const remainingPokemons = 100 - end; // Total number of pokemon - initial batch
                const batchSize = 30;

                // If there are still unfetched pokemon, keep going
                if (remainingPokemons > 0) {
                    // nextStart will be set to the current end so that we can start with the very next pokemon
                    const nextStart = end;
                    // nextEnd will be calculated based on current end and batchSize
                    const nextEnd = Math.min(end + batchSize, 100);
                    // fetch the pokemon using the updated variables
                    fetchPokemonData(nextStart, nextEnd);
                }
            } catch (error) {
                console.error(`Error fetching pokemon data for range ${start} - ${end}:`, error)
            }
        };

        // Fetch the initial 100 pokemon on app start
        fetchPokemonData(0, 20);
    }, []);



    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>

            <Drawer.Navigator>
                <Drawer.Screen name="Pokemon">
                    {(props) => <PokemonStackNavigator {...props} pokemonList={pokemonList} typeData={typeData} />}
                </Drawer.Screen>
                <Drawer.Screen name="Profile" component={ProfileScreen} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
            </Drawer.Navigator>

        </NavigationContainer>
    );
}