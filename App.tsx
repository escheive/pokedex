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
                    const pokemonType = route.params.pokemon.type1;
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



// Open the database
const database = SQLite.openDatabase({
    name: 'Pokemon.db',
    location: 'default',
});

const resetPokemonTable = () => {
  database.transaction((tx) => {
    tx.executeSql(
      `DROP TABLE IF EXISTS pokemon;`,
      [],
      () => {
        console.log('Table "pokemon" dropped successfully');
        createPokemonTable();
      },
      (error) => {
        console.error('Error dropping table "pokemon":', error);
      }
    );
  });
};


// Track if pokemon table is already created
let isTableCreated = false;

// Execute SQL statement to create a pokemon table
const createPokemonTable = () => {
    console.log('createPokemonTable function')
    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `SELECT name FROM sqlite_master WHERE type='table' AND name='Pokemon';`,
                [],
                (tx, result) => {
                    if (result.rows.length === 0) {
                        console.log('Table truly doesnt exist')
                        // If table doesnt exist, create it
                        tx.executeSql(
                            `CREATE TABLE IF NOT EXISTS Pokemon (
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
                                console.log('Table "Pokemon" created successfully');
                                isTableCreated = true;
                                resolve();
                            },
                            (error) => {
                                console.error('Error creating table "Pokemon":', error);
                                reject(error);
                            }
                        );
                    } else {
                        console.log('Table does exist?')
                        // if table already exists
                        isTableCreated = true;
                        resolve();
                    }
                },
                (error) => {
                    console.error('Error checking table "Pokemon":', error);
                    reject(error);
                }
            );
        });
    });
};

// Function to insert a Pokemon record into the pokemon table
const insertPokemon = async (pokemonData) => {
    try {
        await new Promise((resolve, reject) => {
            database.transaction((tx) => {
                pokemonData.forEach((pokemon) => {
                    tx.executeSql(
                        `INSERT OR IGNORE INTO Pokemon (id, name, type1, type2, height, weight, base_experience, ability1, ability2, ability3, capture_rate, evolution_chain_id, image_url)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                        [
                            pokemon.id,
                            pokemon.name,
                            pokemon.types[0].type.name,
                            pokemon.types[1] ? pokemon.types[1].type.name : null,
                            pokemon.height,
                            pokemon.weight,
                            pokemon.base_experience,
                            pokemon.abilities[0] ? pokemon.abilities[0].ability.name : null,
                            pokemon.abilities[1] ? pokemon.abilities[1].ability.name : null,
                            pokemon.abilities[2] ? pokemon.abilities[2].ability.name : null,
                            pokemon.capture_rate,
                            pokemon.species.url,
                            pokemon.sprites.other['official-artwork'].front_default,
                        ],
                        () => {
                            console.log('Pokemon record inserted successfully');
                            resolve();
                        },
                        (error) => {
                            console.error('Error inserting Pokemon record:', error);
                            reject(error);
                        }
                    );
                });
                resolve();
            });
        });
    } catch (error) {
        console.error('Error inserting Pokemon data:', error);
    }
};

// Function to fetch base pokemon data from the api
const fetchPokemonFromAPI = async (start, end, callback) => {
    console.log('fetchingPokemonFromAPI function')
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${end - start}&offset=${start}`);
        const data = await response.json();

        const pokemonUrls = data.results.map((pokemon) => pokemon.url);
        const pokemonData = await Promise.all(pokemonUrls.map((url) => fetch(url).then((response) => response.json())));

        await insertPokemon(pokemonData);

//         setPokemonList((prevList) => [...prevList, ...pokemonData]);
//         setIsLoading(false);
        // Call the callback function with the fetched data
        callback(pokemonData);
    } catch (error) {
        console.error('Error fetching Pokemon data', error);
    }
};


export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);




    useEffect(() => {
        // Function to fetch base pokemon data from the api
        const fetchPokemonData = async (start, end) => {
            try {
                // Wait for the table creation process to complete
                await createPokemonTable();

                await new Promise((resolve, reject) => {
                    database.transaction((tx) => {
                        tx.executeSql(
                            `SELECT * FROM Pokemon WHERE id BETWEEN ? AND ?;`,
                            [start, end],
                            (tx, result) => {
                                if (result.rows.length > 0) {
                                    // Data is already present in the database
                                    const pokemonData = [];

                                    for (let i = 0; i < result.rows.length; i++) {
                                        pokemonData.push(result.rows.item(i));
                                    }

                                    setPokemonList((prevList) => [...prevList, ...pokemonData]);
                                    console.log('data is present');
                                    setIsLoading(false);
                                    resolve();
                                } else {
                                    // Table exists but no data found
                                    setIsLoading(false);
                                    console.log('Table exists, but no data found');
                                    // Check if the data is already present
                                    if (pokemonList.length === 0) {
                                        fetchPokemonFromAPI(start, end, (fetchedPokemonData) => {
                                            setPokemonList((prevList) => [...prevList, ...fetchedPokemonData]);
                                            setIsLoading(false);
                                        });
                                    }
                                    resolve();
                                }
                            },
                            (error) => {
                                console.error('Error checking Pokemon data:', error);
                                reject(error);
                            }
                        );
                    });
                });
            } catch (error) {
                console.error('Error fetching Pokemon data:', error);
            }
        };


//         resetPokemonTable();
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


