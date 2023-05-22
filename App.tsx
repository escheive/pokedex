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
import { capitalizeString } from './src/utils/helpers';
import { fetchPokemonData, fetchPokemonFromAPI } from './src/utils/api';
// Database
import SQLite from 'react-native-sqlite-storage';
import { createPokemonTable, resetPokemonTable, insertPokemon } from './src/utils/database';
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
                    pokemonName = capitalizeString(pokemonName);

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


// Function to create a table for abilities
const createAbilitiesTable = async () => {
    try {
        await database.transaction(async(tx) => {
            await tx.executeSql(`
                CREATE TABLE IF NOT EXISTS Abilities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    abilityName TEXT,
                    abilityDescription TEXT,
                    pokemonWithAbility TEXT
                );
            `);
        })

        console.log('Abilities table created successfully');
    } catch (error) {
        console.error('Error creating Abilities table in the createAbilitiesTable function:', error);
    }
};



export default function App() {
    const [isLoading, setIsLoading] = useState("Loading...");
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

    // Open the database
    const database = SQLite.openDatabase({
        name: 'Pokemon.db',
        location: 'default',
    });

    useEffect(() => {

//         resetPokemonTable();
        fetchPokemonData(database, createPokemonTable, insertPokemon, setIsLoading, setPokemonList);
    }, []);



    if (isLoading) {
        return <LoadingScreen isLoading={isLoading} />;
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


